import { ApiError, API_ERROR_CODES, apiErrorFromResponse } from './ApiError';
import type { HttpInterceptors } from './interceptors';
import { createInterceptors } from './interceptors';
import type {
  HttpMethod,
  HttpRequestBody,
  HttpRequestConfig,
  HttpRequestOptions,
} from './types';

/**
 * Thin wrapper over React Native's built-in `fetch` (TECH_SPEC §3) — the only
 * networking primitive in the app. Adds base URL joining, JSON / form
 * serialization, a timeout, interceptor hooks, and error normalization: no
 * raw fetch error ever leaves this file (§2.5). Nothing is logged here —
 * tokens and request bodies must never reach a logger.
 */

const DEFAULT_TIMEOUT_MS = 15_000;

export interface HttpClient {
  readonly interceptors: HttpInterceptors;
  get<T = unknown>(path: string, options?: HttpRequestOptions): Promise<T>;
  post<T = unknown>(
    path: string,
    body?: HttpRequestBody,
    options?: HttpRequestOptions,
  ): Promise<T>;
  put<T = unknown>(
    path: string,
    body?: HttpRequestBody,
    options?: HttpRequestOptions,
  ): Promise<T>;
  delete<T = unknown>(path: string, options?: HttpRequestOptions): Promise<T>;
}

export interface HttpClientConfig {
  baseUrl: string;
  timeoutMs?: number;
}

function buildUrl(
  baseUrl: string,
  path: string,
  query?: HttpRequestOptions['query'],
): string {
  const url = `${baseUrl.replace(/\/$/, '')}${path}`;
  if (!query) return url;

  const pairs = Object.entries(query)
    .filter(([, value]) => value !== undefined)
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`,
    );
  return pairs.length ? `${url}?${pairs.join('&')}` : url;
}

/** Mirrors curl's --data-urlencode: every key and value percent-encoded. */
function encodeForm(form: Record<string, string>): string {
  return Object.entries(form)
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(value)}`,
    )
    .join('&');
}

function serializeBody(body: HttpRequestBody): {
  body: string;
  contentType: string;
} {
  if ('form' in body) {
    return {
      body: encodeForm(body.form),
      contentType: 'application/x-www-form-urlencoded',
    };
  }
  return { body: JSON.stringify(body.json), contentType: 'application/json' };
}

/** Body is read as text first: empty (204) and non-JSON bodies must not throw. */
function parseResponseText(text: string): unknown {
  if (!text) return undefined;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

export function createHttpClient(clientConfig: HttpClientConfig): HttpClient {
  const interceptors = createInterceptors();

  async function request<T>(
    method: HttpMethod,
    path: string,
    body?: HttpRequestBody,
    options: HttpRequestOptions = {},
  ): Promise<T> {
    let config: HttpRequestConfig = {
      url: buildUrl(clientConfig.baseUrl, path, options.query),
      method,
      headers: { Accept: 'application/json', ...options.headers },
      timeoutMs:
        options.timeoutMs ?? clientConfig.timeoutMs ?? DEFAULT_TIMEOUT_MS,
    };
    if (body) {
      const serialized = serializeBody(body);
      config.body = serialized.body;
      config.headers['Content-Type'] =
        config.headers['Content-Type'] ?? serialized.contentType;
    }

    try {
      for (const interceptor of interceptors.request.all) {
        config = await interceptor(config);
      }
      let data = await execute(config);
      for (const interceptor of interceptors.response.all) {
        data = await interceptor(data, config);
      }
      return data as T;
    } catch (error) {
      let normalized = ApiError.isApiError(error)
        ? error
        : new ApiError({
            status: 0,
            code: API_ERROR_CODES.network,
            message: 'Unable to reach the server.',
          });
      for (const interceptor of interceptors.error.all) {
        normalized = await interceptor(normalized, config);
      }
      throw normalized;
    }
  }

  async function execute(config: HttpRequestConfig): Promise<unknown> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), config.timeoutMs);

    let response: Response;
    try {
      response = await fetch(config.url, {
        method: config.method,
        headers: config.headers,
        body: config.body,
        signal: controller.signal,
      });
    } catch (error) {
      const aborted =
        error instanceof Error &&
        (error.name === 'AbortError' || controller.signal.aborted);
      throw new ApiError({
        status: 0,
        code: aborted ? API_ERROR_CODES.timeout : API_ERROR_CODES.network,
        message: aborted
          ? 'The request timed out.'
          : 'Unable to reach the server.',
      });
    } finally {
      clearTimeout(timer);
    }

    const parsed = parseResponseText(await response.text());
    if (!response.ok) {
      throw apiErrorFromResponse(response.status, parsed);
    }
    return parsed;
  }

  return {
    interceptors,
    get: (path, options) => request('GET', path, undefined, options),
    post: (path, body, options) => request('POST', path, body, options),
    put: (path, body, options) => request('PUT', path, body, options),
    delete: (path, options) => request('DELETE', path, undefined, options),
  };
}
