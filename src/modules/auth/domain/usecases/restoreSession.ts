import type { IAuthRepository } from '../repositories/IAuthRepository';
import type { AuthSession } from '../schemas';

export type RestoreSessionUseCase = () => Promise<AuthSession | null>;

/**
 * UC-03 Restore Session (app cold start) — no network call, expiry check is
 * local. An expired session gets cleared, not reused.
 */
export function makeRestoreSessionUseCase(
  repository: IAuthRepository,
): RestoreSessionUseCase {
  return async () => {
    const session = await repository.loadSession();
    if (!session) return null;
    if (session.expiresAt <= Date.now()) {
      await repository.clearSession();
      return null;
    }
    return session;
  };
}
