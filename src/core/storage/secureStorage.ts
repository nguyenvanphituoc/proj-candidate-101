import * as Keychain from 'react-native-keychain';

/**
 * Feature-blind secure key-value storage (TECH_SPEC §4 core/storage).
 * Values land in the iOS Keychain / Android Keystore via react-native-keychain
 * — AsyncStorage is plaintext and fails the security criterion.
 *
 * Falls back to process memory when the native module is unavailable (fresh
 * checkout before pod install) so the mock flows stay demoable; a memory-only
 * session simply doesn't survive a cold start.
 */
export interface SecureStorage {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
}

const memoryFallback = new Map<string, string>();

export const secureStorage: SecureStorage = {
  async getItem(key) {
    try {
      const result = await Keychain.getGenericPassword({ service: key });
      return result ? result.password : null;
    } catch {
      return memoryFallback.get(key) ?? null;
    }
  },

  async setItem(key, value) {
    try {
      await Keychain.setGenericPassword(key, value, { service: key });
    } catch {
      memoryFallback.set(key, value);
    }
  },

  async removeItem(key) {
    try {
      await Keychain.resetGenericPassword({ service: key });
    } catch {
      // fall through to the in-memory copy either way
    }
    memoryFallback.delete(key);
  },
};
