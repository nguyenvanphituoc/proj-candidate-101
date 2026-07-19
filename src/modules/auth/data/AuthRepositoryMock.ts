import type { SecureStorage } from '@core/storage/secureStorage';

import type {
  IAuthRepository,
  TokenGrant,
} from '../domain/repositories/IAuthRepository';
import type { AuthSession, User } from '../domain/schemas';
import { AuthSessionSchema } from '../domain/schemas';

/**
 * Stand-in for AuthRepositoryImpl until core/network + the sandbox WSO2 /
 * membership-service land (TECH_SPEC §2.3 / §6). Simulated latency keeps the
 * loading states honest; sessions persist through the same secure storage the
 * real implementation will use, so swapping it in only replaces this file.
 *
 * Demo accounts:
 *   demo / demo123      → one membership, logs in
 *   nomember / demo123  → valid credentials but no membership (UC-01 error path)
 */

const SESSION_KEY = 'simpleinvoice.session';
const NETWORK_DELAY_MS = 400;
const TOKEN_TTL_SEC = 3600;

interface MockAccount {
  username: string;
  password: string;
  profile: User;
}

const MOCK_ACCOUNTS: MockAccount[] = [
  {
    username: 'demo',
    password: 'demo123',
    profile: {
      userId: 'user-demo',
      firstName: 'Demo',
      lastName: 'User',
      memberships: [
        {
          organisationId: 'org-101',
          organisationName: '101 Digital Demo Org',
          token: 'mock-org-token-org-101',
        },
      ],
    },
  },
  {
    username: 'nomember',
    password: 'demo123',
    profile: {
      userId: 'user-nomember',
      firstName: 'No',
      lastName: 'Member',
      memberships: [],
    },
  },
];

const delay = () =>
  new Promise<void>(resolve => setTimeout(resolve, NETWORK_DELAY_MS));

export class AuthRepositoryMock implements IAuthRepository {
  constructor(private readonly storage: SecureStorage) {}

  async exchangeCredentials(
    username: string,
    password: string,
  ): Promise<TokenGrant> {
    await delay();
    const account = MOCK_ACCOUNTS.find(
      candidate =>
        candidate.username === username.toLowerCase() &&
        candidate.password === password,
    );
    if (!account) {
      // same message the real token endpoint failure maps to (UC-01)
      throw new Error('Invalid username or password.');
    }
    return {
      accessToken: `mock-access-token:${account.username}`,
      expiresInSec: TOKEN_TTL_SEC,
    };
  }

  async getProfile(accessToken: string): Promise<User> {
    await delay();
    const username = accessToken.split(':')[1];
    const account = MOCK_ACCOUNTS.find(
      candidate => candidate.username === username,
    );
    if (!account) {
      // mock equivalent of a 401 (UC-02)
      throw new Error('Session expired — please sign in again.');
    }
    return account.profile;
  }

  async saveSession(session: AuthSession): Promise<void> {
    await this.storage.setItem(SESSION_KEY, JSON.stringify(session));
  }

  async loadSession(): Promise<AuthSession | null> {
    const raw = await this.storage.getItem(SESSION_KEY);
    if (!raw) return null;
    try {
      const parsed = AuthSessionSchema.safeParse(JSON.parse(raw));
      return parsed.success ? parsed.data : null;
    } catch {
      // unreadable stored value = no session
      return null;
    }
  }

  async clearSession(): Promise<void> {
    await this.storage.removeItem(SESSION_KEY);
  }
}
