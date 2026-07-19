import Config from 'react-native-config';

import type { HttpClient } from '@core/network';
import { ApiError } from '@core/network';
import type { SecureStorage } from '@core/storage/secureStorage';

import type {
  IAuthRepository,
  TokenGrant,
} from '../domain/repositories/IAuthRepository';
import type { AuthSession, User } from '../domain/schemas';
import { GetMeResponseDtoSchema, TokenResponseDtoSchema } from './authDtos';
import { mapTokenGrant, mapUser } from './authMapper';
import { makeSessionStore } from './sessionStore';

/**
 * Real data layer for the auth module (TECH_SPEC §2.3 / §4): WSO2 password
 * grant + membership-service profile, session in secure storage. Only
 * user-safe Error messages leave this class — ApiError details stay in the
 * data layer, and credentials/tokens are never logged.
 */

/** Relative to AUTH_BASE_URL, which ends in /oauth2 (Appendix A). */
const TOKEN_PATH = '/token';
const USERS_ME_PATH = '/membership-service/1.0.0/users/me';

const MESSAGES = {
  invalidCredentials: 'Invalid username or password.',
  sessionExpired: 'Session expired — please sign in again.',
  offline: 'Network error — please check your connection and try again.',
  unexpected: 'Something went wrong. Please try again.',
} as const;

/** Collapses an ApiError into a user-safe message; anything else → generic. */
function toUserSafeError(
  error: unknown,
  byStatus: Partial<Record<number, string>>,
): Error {
  if (ApiError.isApiError(error)) {
    if (error.isTransportError) return new Error(MESSAGES.offline);
    const mapped = byStatus[error.status];
    if (mapped) return new Error(mapped);
  }
  return new Error(MESSAGES.unexpected);
}

export class AuthRepositoryImpl implements IAuthRepository {
  private readonly sessionStore: ReturnType<typeof makeSessionStore>;

  constructor(
    storage: SecureStorage,
    private readonly authHttp: HttpClient,
    private readonly apiHttp: HttpClient,
  ) {
    this.sessionStore = makeSessionStore(storage);
  }

  async exchangeCredentials(
    username: string,
    password: string,
  ): Promise<TokenGrant> {
    let raw: unknown;
    try {
      raw = await this.authHttp.post(TOKEN_PATH, {
        form: {
          // ADR-001: credentials move to the native secrets module when it
          // lands; until then react-native-config is the single source
          client_id: Config.CLIENT_ID ?? '',
          client_secret: Config.CLIENT_SECRET ?? '',
          grant_type: 'password',
          scope: 'openid',
          username,
          password,
        },
      });
    } catch (error) {
      // WSO2 answers a wrong password with 400 invalid_grant, not 401
      throw toUserSafeError(error, {
        400: MESSAGES.invalidCredentials,
        401: MESSAGES.invalidCredentials,
      });
    }

    const dto = TokenResponseDtoSchema.safeParse(raw);
    if (!dto.success) throw new Error(MESSAGES.unexpected);
    return mapTokenGrant(dto.data);
  }

  async getProfile(accessToken: string): Promise<User> {
    let raw: unknown;
    try {
      raw = await this.apiHttp.get(USERS_ME_PATH, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
    } catch (error) {
      throw toUserSafeError(error, { 401: MESSAGES.sessionExpired });
    }

    const dto = GetMeResponseDtoSchema.safeParse(raw);
    if (!dto.success) throw new Error(MESSAGES.unexpected);
    return mapUser(dto.data);
  }

  saveSession(session: AuthSession): Promise<void> {
    return this.sessionStore.save(session);
  }

  loadSession(): Promise<AuthSession | null> {
    return this.sessionStore.load();
  }

  clearSession(): Promise<void> {
    return this.sessionStore.clear();
  }
}
