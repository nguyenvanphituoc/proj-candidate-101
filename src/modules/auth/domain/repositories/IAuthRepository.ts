import type { AuthSession, User } from '../schemas';

/** Result of the credential exchange (OAuth2 password grant, TECH_SPEC §2.3). */
export interface TokenGrant {
  accessToken: string;
  /** Lifetime in seconds, relative to now. */
  expiresInSec: number;
}

/** Data-layer contract for the auth module (TECH_SPEC §4). */
export interface IAuthRepository {
  /** Rejects with a user-safe message on wrong credentials. */
  exchangeCredentials(username: string, password: string): Promise<TokenGrant>;
  getProfile(accessToken: string): Promise<User>;
  saveSession(session: AuthSession): Promise<void>;
  /** Returns null when nothing is stored (or the stored value is unreadable). */
  loadSession(): Promise<AuthSession | null>;
  clearSession(): Promise<void>;
}
