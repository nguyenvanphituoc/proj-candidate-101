import type { IAuthRepository } from '../repositories/IAuthRepository';

export type LogoutUseCase = () => Promise<void>;

/**
 * UC-04 Logout — local clear only so it works offline. Clearing cached
 * server data is the composition root's job (it owns the query client).
 */
export function makeLogoutUseCase(repository: IAuthRepository): LogoutUseCase {
  return () => repository.clearSession();
}
