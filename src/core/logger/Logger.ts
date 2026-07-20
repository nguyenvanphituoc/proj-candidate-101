/**
 * Thin wrapper over console — the one place logging is gated and formatted,
 * so call sites never touch `console` directly and a real sink can replace
 * it later without churn. Callers are responsible for what they pass in:
 * tokens and request bodies must never reach a logger (TECH_SPEC §2.5).
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface Logger {
  debug(message: string, ...meta: unknown[]): void;
  info(message: string, ...meta: unknown[]): void;
  warn(message: string, ...meta: unknown[]): void;
  error(message: string, ...meta: unknown[]): void;
}

const CONSOLE_METHOD: Record<LogLevel, (...args: unknown[]) => void> = {
  debug: console.debug,
  info: console.info,
  warn: console.warn,
  error: console.error,
};

function log(
  level: LogLevel,
  tag: string,
  message: string,
  meta: unknown[],
): void {
  CONSOLE_METHOD[level](`[${tag}] ${message}`, ...meta);
}

/** Scopes every line with `tag`, e.g. createLogger('HTTP') → "[HTTP] ...". */
export function createLogger(tag: string): Logger {
  return {
    debug: (message, ...meta) => log('debug', tag, message, meta),
    info: (message, ...meta) => log('info', tag, message, meta),
    warn: (message, ...meta) => log('warn', tag, message, meta),
    error: (message, ...meta) => log('error', tag, message, meta),
  };
}

export const logger = createLogger('App');
