import type { SecureStorage } from '@core/storage/secureStorage';

import type { AuthSession } from '../domain/schemas';
import { AuthSessionSchema } from '../domain/schemas';

/**
 * Session persistence shared by the real and mock repositories — one atomic
 * value in the keychain (UC-01 all-or-nothing rule).
 */

export const SESSION_KEY = 'simpleinvoice.session';

export function makeSessionStore(storage: SecureStorage) {
  return {
    async save(session: AuthSession): Promise<void> {
      await storage.setItem(SESSION_KEY, JSON.stringify(session));
    },

    async load(): Promise<AuthSession | null> {
      const raw = await storage.getItem(SESSION_KEY);
      if (!raw) return null;
      try {
        const parsed = AuthSessionSchema.safeParse(JSON.parse(raw));
        return parsed.success ? parsed.data : null;
      } catch {
        // unreadable stored value = no session
        return null;
      }
    },

    async clear(): Promise<void> {
      await storage.removeItem(SESSION_KEY);
    },
  };
}
