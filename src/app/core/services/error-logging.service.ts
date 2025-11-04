// src/app/core/services/error-logging.service.ts
import { Injectable } from '@angular/core';

export enum LogLevel {
  ERROR = 'ERROR',
  WARN = 'WARN',
  INFO = 'INFO',
  DEBUG = 'DEBUG'
}

export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: Date;
  error?: any;
  context?: any;
}

@Injectable({
  providedIn: 'root'
})
export class ErrorLoggingService {
  private logs: LogEntry[] = [];
  private maxLogs = 100; // Keep last 100 logs in memory

  /**
   * Log an error message with optional error object and context
   */
  error(message: string, error?: any, context?: any): void {
    this.log(LogLevel.ERROR, message, error, context);

    // In production, this would be where we send to Sentry, Rollbar, etc.
    // For now, we'll log to console in non-production environments
    if (this.isDevelopment()) {
      console.error(`[ERROR] ${message}`, error, context);
    }
  }

  /**
   * Log a warning message with optional context
   */
  warn(message: string, context?: any): void {
    this.log(LogLevel.WARN, message, undefined, context);

    if (this.isDevelopment()) {
      console.warn(`[WARN] ${message}`, context);
    }
  }

  /**
   * Log an info message with optional context
   */
  info(message: string, context?: any): void {
    this.log(LogLevel.INFO, message, undefined, context);

    if (this.isDevelopment()) {
      console.info(`[INFO] ${message}`, context);
    }
  }

  /**
   * Log a debug message with optional context
   */
  debug(message: string, context?: any): void {
    this.log(LogLevel.DEBUG, message, undefined, context);

    if (this.isDevelopment()) {
      console.debug(`[DEBUG] ${message}`, context);
    }
  }

  /**
   * Get all stored logs
   */
  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  /**
   * Get logs filtered by level
   */
  getLogsByLevel(level: LogLevel): LogEntry[] {
    return this.logs.filter(log => log.level === level);
  }

  /**
   * Clear all stored logs
   */
  clearLogs(): void {
    this.logs = [];
  }

  /**
   * Internal logging method
   */
  private log(level: LogLevel, message: string, error?: any, context?: any): void {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date(),
      error,
      context
    };

    this.logs.push(entry);

    // Keep only the last maxLogs entries
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    // Future integration point for error tracking services
    // this.sendToErrorTrackingService(entry);
  }

  /**
   * Check if running in development mode
   */
  private isDevelopment(): boolean {
    // This can be enhanced to check environment configuration
    return true; // For now, always log to console
  }

  /**
   * Future method for sending logs to external service
   * @param entry The log entry to send
   */
  private sendToErrorTrackingService(entry: LogEntry): void {
    // Integration point for Sentry, Rollbar, LogRocket, etc.
    // Example:
    // if (entry.level === LogLevel.ERROR) {
    //   Sentry.captureException(entry.error, {
    //     extra: {
    //       message: entry.message,
    //       context: entry.context
    //     }
    //   });
    // }
  }
}
