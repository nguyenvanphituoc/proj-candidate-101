import type { IAuthRepository } from '../repositories/IAuthRepository';
import type { User } from '../schemas';

export type GetMyProfileUseCase = (accessToken: string) => Promise<User>;

/**
 * UC-02 Get My Profile — read only, no side effects. Called inside login
 * (step 2); an empty membership list is returned as-is, the caller decides
 * (login treats it as failure).
 */
export function makeGetMyProfileUseCase(
  repository: IAuthRepository,
): GetMyProfileUseCase {
  return accessToken => repository.getProfile(accessToken);
}
