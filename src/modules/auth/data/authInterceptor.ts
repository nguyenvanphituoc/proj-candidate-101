import type { HttpClient } from '@core/network';

import type { AuthSession } from '../domain/schemas';

/**
 * The header interceptor the auth module contributes to the shared api client
 * (TECH_SPEC §2.2): registered at composition time so other modules (invoice)
 * get Bearer + org-token headers with zero imports from auth. Also implements
 * the §2.5 rule: a 401 on any request forces logout and session wipe.
 */

export interface AuthInterceptorHooks {
  /** Current session, or null when signed out. */
  getSession: () => AuthSession | null;
  /** Called once per 401 received while a session exists. */
  onUnauthorized: () => void;
}

export function registerAuthInterceptors(
  http: HttpClient,
  hooks: AuthInterceptorHooks,
): () => void {
  const unsubscribeRequest = http.interceptors.request.use(config => {
    const session = hooks.getSession();
    // explicit Authorization (e.g. the login-time profile call) wins
    if (!session || config.headers.Authorization) return config;
    return {
      ...config,
      headers: {
        ...config.headers,
        Authorization: `Bearer ${session.accessToken}`,
        'org-token': session.orgToken,
      },
    };
  });

  const unsubscribeError = http.interceptors.error.use(error => {
    if (error.status === 401 && hooks.getSession()) {
      hooks.onUnauthorized();
    }
    return error;
  });

  return () => {
    unsubscribeRequest();
    unsubscribeError();
  };
}
