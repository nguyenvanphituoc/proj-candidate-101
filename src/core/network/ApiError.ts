/**
 * The one error type that leaves the network layer (TECH_SPEC §2.5) — every
 * transport failure, timeout, and non-2xx response is normalized into this.
 * `status === 0` means the request never got an HTTP response (network down,
 * timeout, abort).
 */

/** Transport-level codes; server responses carry their own code when present. */
export const API_ERROR_CODES = {
  network: 'NETWORK_ERROR',
  timeout: 'TIMEOUT',
  parse: 'PARSE_ERROR',
} as const;

export class ApiError extends Error {
  /** HTTP status; 0 when no response was received. */
  readonly status: number;
  /** Server error code when the body carried one, else a transport/HTTP_nnn code. */
  readonly code: string;
  /** Parsed response body, for callers that need field-level details. */
  readonly details?: unknown;

  constructor(args: {
    status: number;
    code: string;
    message: string;
    details?: unknown;
  }) {
    super(args.message);
    this.name = 'ApiError';
    this.status = args.status;
    this.code = args.code;
    this.details = args.details;
  }

  /** True when the request never reached the server (offline / timeout). */
  get isTransportError(): boolean {
    return this.status === 0;
  }

  static isApiError(error: unknown): error is ApiError {
    return error instanceof ApiError;
  }
}

/**
 * Builds an ApiError from a non-2xx response body. Understands the common
 * shapes of the sandbox services without being coupled to any feature:
 *   - OAuth2/WSO2:  { error, error_description }
 *   - 101 Digital:  { errors: [{ code, message }] }
 *   - generic:      { code, message }
 */
export function apiErrorFromResponse(status: number, body: unknown): ApiError {
  let code = `HTTP_${status}`;
  let message = `Request failed with status ${status}`;

  if (body && typeof body === 'object') {
    const record = body as Record<string, unknown>;
    const firstError = Array.isArray(record.errors)
      ? (record.errors[0] as Record<string, unknown> | undefined)
      : undefined;

    const rawCode = firstError?.code ?? record.code ?? record.error;
    const rawMessage =
      firstError?.message ??
      record.message ??
      record.error_description ??
      record.error;

    if (typeof rawCode === 'string' && rawCode) code = rawCode;
    if (typeof rawMessage === 'string' && rawMessage) message = rawMessage;
  }

  return new ApiError({ status, code, message, details: body });
}
