/**
 * Logging Infrastructure
 *
 * Provides structured logging with different log levels and metadata support.
 * In production, can be easily integrated with external services like:
 * - Sentry (error tracking)
 * - LogRocket (session replay)
 * - Datadog (monitoring)
 * - CloudWatch (AWS logging)
 *
 * Usage:
 *   import { logger } from '@/lib/logger';
 *   logger.info('User logged in', { userId: '123' });
 *   logger.error('Failed to save', error, { context: 'blog-post' });
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';
type LogMetadata = Record<string, unknown>;

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  metadata?: LogMetadata;
  error?: {
    name: string;
    message: string;
    stack?: string;
  };
}

/**
 * Formats timestamp for log entries
 */
function getTimestamp(): string {
  return new Date().toISOString();
}

/**
 * Formats log entry for console output
 */
function formatLogEntry(entry: LogEntry): string {
  const parts = [`[${entry.level.toUpperCase()}]`, entry.timestamp, entry.message];

  if (entry.metadata && Object.keys(entry.metadata).length > 0) {
    parts.push(JSON.stringify(entry.metadata));
  }

  return parts.join(' ');
}

/**
 * Sends log entry to external service in production
 * Placeholder for integration with logging services
 */
function sendToExternalService(entry: LogEntry): void {
  // In production, send to your logging service
  // Example integrations:
  //
  // Sentry:
  // if (entry.level === 'error' && entry.error) {
  //   Sentry.captureException(new Error(entry.error.message));
  // }
  //
  // Custom API:
  // fetch('/api/logs', {
  //   method: 'POST',
  //   body: JSON.stringify(entry),
  // });
  //
  // For now, we just use console in all environments
}

/**
 * Core logging function
 */
function log(level: LogLevel, message: string, metadata?: LogMetadata, error?: Error): void {
  const entry: LogEntry = {
    level,
    message,
    timestamp: getTimestamp(),
    metadata,
    error: error
      ? {
          name: error.name,
          message: error.message,
          stack: error.stack,
        }
      : undefined,
  };

  // Console output (always)
  const formattedMessage = formatLogEntry(entry);

  switch (level) {
    case 'debug':
      console.debug(formattedMessage, error || '');
      break;
    case 'info':
      console.log(formattedMessage);
      break;
    case 'warn':
      console.warn(formattedMessage, error || '');
      break;
    case 'error':
      console.error(formattedMessage, error || '');
      break;
  }

  // Send to external service in production
  if (process.env.NODE_ENV === 'production') {
    sendToExternalService(entry);
  }
}

/**
 * Logger instance with typed methods
 */
export const logger = {
  /**
   * Debug level - detailed information for debugging
   * Only logged in development
   */
  debug: (message: string, metadata?: LogMetadata): void => {
    if (process.env.NODE_ENV === 'development') {
      log('debug', message, metadata);
    }
  },

  /**
   * Info level - general informational messages
   */
  info: (message: string, metadata?: LogMetadata): void => {
    log('info', message, metadata);
  },

  /**
   * Warn level - warning messages that don't stop execution
   */
  warn: (message: string, metadata?: LogMetadata, error?: Error): void => {
    log('warn', message, metadata, error);
  },

  /**
   * Error level - error messages for failures
   * Should always include the error object
   */
  error: (message: string, error: Error, metadata?: LogMetadata): void => {
    log('error', message, metadata, error);
  },
};

/**
 * Type export for external integrations
 */
export type { LogLevel, LogMetadata, LogEntry };
