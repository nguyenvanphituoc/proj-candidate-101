import Config from 'react-native-config';

import { createLogger } from '../logger';
import type { HttpClient } from './httpClient';
import { createHttpClient } from './httpClient';

/**
 * The app's two HTTP client instances, one per sandbox host (TECH_SPEC §2.1):
 *   authHttpClient → WSO2 identity provider (AUTH_BASE_URL, ends in /oauth2)
 *   apiHttpClient  → business services: membership-service, invoice-service
 *
 * Base URLs come from react-native-config's .env — URLs only, never secrets
 * (ADR-001). `hasNetworkConfig` lets composition fall back to mocks on a
 * fresh checkout with an empty .env.
 */

export const hasNetworkConfig = Boolean(
  Config.AUTH_BASE_URL && Config.API_BASE_URL,
);

/** Keys masked out of logged response bodies — token/secret fields the
 *  sandbox services return (OAuth tokens, org tokens, ...). Outgoing request
 *  bodies are never logged at all (TECH_SPEC §2.5); this only covers what
 *  comes back. */
const REDACTED_KEYS = new Set([
  'password',
  'token',
  'accesstoken',
  'refreshtoken',
  'orgtoken',
  'authorization',
  'secret',
]);

function redact(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(redact);
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, val]) => [
        key,
        REDACTED_KEYS.has(key.toLowerCase()) ? '[REDACTED]' : redact(val),
      ]),
    );
  }
  return value;
}

/**
 * Monitors traffic through a client's repository layer: outgoing method/url
 * on every request, status/code on every failure, and the parsed response
 * body on every success (token/secret fields redacted — see `redact`).
 * Request headers and bodies are never passed to the logger at all.
 */
function attachTrafficLogging(client: HttpClient, tag: string): void {
  const log = createLogger(tag);

  client.interceptors.request.use(config => {
    log.info(`→ ${config.method} ${config.url}`);
    return config;
  });

  client.interceptors.response.use((data, config) => {
    log.info(`← ${config.method} ${config.url}`, redact(data));
    return data;
  });

  client.interceptors.error.use((error, config) => {
    log.error(`✗ ${config.method} ${config.url}`, {
      status: error.status,
      code: error.code,
    });
    return error;
  });
}

export const authHttpClient = createHttpClient({
  baseUrl: Config.AUTH_BASE_URL ?? '',
});
attachTrafficLogging(authHttpClient, 'HTTP:auth');

export const apiHttpClient = createHttpClient({
  baseUrl: Config.API_BASE_URL ?? '',
});
attachTrafficLogging(apiHttpClient, 'HTTP:api');
