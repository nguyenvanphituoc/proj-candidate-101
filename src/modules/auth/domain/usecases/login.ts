import type { IAuthRepository } from '../repositories/IAuthRepository';
import type { AuthSession } from '../schemas';
import type { GetMyProfileUseCase } from './getMyProfile';

export type LoginUseCase = (
  username: string,
  password: string,
) => Promise<AuthSession>;

/**
 * UC-01 Login: exchange credentials → fetch profile → org token from the
 * first membership → persist all-or-nothing. Credentials themselves are
 * never stored and never logged.
 */
export function makeLoginUseCase(
  repository: IAuthRepository,
  getMyProfile: GetMyProfileUseCase,
): LoginUseCase {
  return async (username, password) => {
    const grant = await repository.exchangeCredentials(username, password);
    const user = await getMyProfile(grant.accessToken);

    const membership = user.memberships[0];
    if (!membership) {
      // profile ok but no membership → login failure, nothing stored (UC-01)
      throw new Error('Login failed — this account has no organisation.');
    }

    const session: AuthSession = {
      accessToken: grant.accessToken,
      orgToken: membership.token,
      expiresAt: Date.now() + grant.expiresInSec * 1000,
      userName: [user.firstName, user.lastName].filter(Boolean).join(' '),
    };
    // persisted only once both tokens exist — all-or-nothing rule (UC-01)
    await repository.saveSession(session);
    return session;
  };
}
