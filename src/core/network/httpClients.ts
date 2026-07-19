import Config from 'react-native-config';

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

export const authHttpClient = createHttpClient({
  baseUrl: Config.AUTH_BASE_URL ?? '',
});

export const apiHttpClient = createHttpClient({
  baseUrl: Config.API_BASE_URL ?? '',
});
