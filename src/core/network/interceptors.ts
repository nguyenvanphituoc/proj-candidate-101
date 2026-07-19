import type { ApiError } from './ApiError';
import type { HttpRequestConfig } from './types';

/**
 * Interceptors kept separate from the client (TECH_SPEC §2.2): core stays
 * feature-blind, and features (e.g. auth headers, 401 handling) register
 * themselves at composition time. Each `use()` returns an unsubscribe.
 */

/** Runs before fetch; may rewrite the outgoing config (e.g. add headers). */
export type RequestInterceptor = (
  config: HttpRequestConfig,
) => HttpRequestConfig | Promise<HttpRequestConfig>;

/**
 * Runs when a request ends in an ApiError, before it is thrown; may observe
 * (401 → force logout) or replace the error with a transformed one.
 */
export type ErrorInterceptor = (
  error: ApiError,
  config: HttpRequestConfig,
) => ApiError | Promise<ApiError>;

export class InterceptorChain<T> {
  private handlers: T[] = [];

  use(handler: T): () => void {
    this.handlers.push(handler);
    return () => {
      this.handlers = this.handlers.filter(
        candidate => candidate !== handler,
      );
    };
  }

  get all(): readonly T[] {
    return this.handlers;
  }
}

export interface HttpInterceptors {
  request: InterceptorChain<RequestInterceptor>;
  error: InterceptorChain<ErrorInterceptor>;
}

export function createInterceptors(): HttpInterceptors {
  return {
    request: new InterceptorChain<RequestInterceptor>(),
    error: new InterceptorChain<ErrorInterceptor>(),
  };
}
