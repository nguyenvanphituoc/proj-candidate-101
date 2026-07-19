export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

/** The fully-built outgoing request — what request interceptors see. */
export interface HttpRequestConfig {
  /** Absolute URL, query string included. */
  url: string;
  method: HttpMethod;
  headers: Record<string, string>;
  /** Serialized body (JSON string or form-urlencoded string). */
  body?: string;
  timeoutMs: number;
}

/**
 * Exactly one body kind per request:
 *   json → serialized with JSON.stringify, Content-Type application/json
 *   form → urlencoded per RFC 1866, Content-Type application/x-www-form-urlencoded
 */
export type HttpRequestBody =
  | { json: unknown }
  | { form: Record<string, string> };

export interface HttpRequestOptions {
  headers?: Record<string, string>;
  /** Appended to the URL; undefined values are dropped. */
  query?: Record<string, string | number | boolean | undefined>;
  timeoutMs?: number;
}
