// src/app/core/services/error-logging.service.spec.ts
import { TestBed } from '@angular/core/testing';
import { ErrorLoggingService, LogLevel } from './error-logging.service';

describe('ErrorLoggingService', () => {
  let service: ErrorLoggingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ErrorLoggingService);

    // Clear logs before each test
    service.clearLogs();

    // Spy on console methods
    spyOn(console, 'error');
    spyOn(console, 'warn');
    spyOn(console, 'info');
    spyOn(console, 'debug');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('error()', () => {
    it('should log error messages', () => {
      const message = 'Test error message';
      const error = new Error('Test error');
      const context = { userId: 123 };

      service.error(message, error, context);

      const logs = service.getLogs();
      expect(logs.length).toBe(1);
      expect(logs[0].level).toBe(LogLevel.ERROR);
      expect(logs[0].message).toBe(message);
      expect(logs[0].error).toBe(error);
      expect(logs[0].context).toEqual(context);
      expect(logs[0].timestamp).toBeInstanceOf(Date);
    });

    it('should call console.error in development', () => {
      const message = 'Test error';
      const error = new Error('Test');

      service.error(message, error);

      expect(console.error).toHaveBeenCalledWith(
        `[ERROR] ${message}`,
        error,
        undefined
      );
    });

    it('should handle error without error object', () => {
      const message = 'Test error message';

      service.error(message);

      const logs = service.getLogs();
      expect(logs.length).toBe(1);
      expect(logs[0].error).toBeUndefined();
    });
  });

  describe('warn()', () => {
    it('should log warning messages', () => {
      const message = 'Test warning';
      const context = { action: 'save' };

      service.warn(message, context);

      const logs = service.getLogs();
      expect(logs.length).toBe(1);
      expect(logs[0].level).toBe(LogLevel.WARN);
      expect(logs[0].message).toBe(message);
      expect(logs[0].context).toEqual(context);
    });

    it('should call console.warn in development', () => {
      const message = 'Test warning';
      const context = { test: true };

      service.warn(message, context);

      expect(console.warn).toHaveBeenCalledWith(
        `[WARN] ${message}`,
        context
      );
    });
  });

  describe('info()', () => {
    it('should log info messages', () => {
      const message = 'Test info';
      const context = { status: 'success' };

      service.info(message, context);

      const logs = service.getLogs();
      expect(logs.length).toBe(1);
      expect(logs[0].level).toBe(LogLevel.INFO);
      expect(logs[0].message).toBe(message);
    });

    it('should call console.info in development', () => {
      const message = 'Test info';

      service.info(message);

      expect(console.info).toHaveBeenCalledWith(
        `[INFO] ${message}`,
        undefined
      );
    });
  });

  describe('debug()', () => {
    it('should log debug messages', () => {
      const message = 'Test debug';
      const context = { value: 42 };

      service.debug(message, context);

      const logs = service.getLogs();
      expect(logs.length).toBe(1);
      expect(logs[0].level).toBe(LogLevel.DEBUG);
      expect(logs[0].message).toBe(message);
    });

    it('should call console.debug in development', () => {
      const message = 'Test debug';

      service.debug(message);

      expect(console.debug).toHaveBeenCalledWith(
        `[DEBUG] ${message}`,
        undefined
      );
    });
  });

  describe('getLogs()', () => {
    it('should return all logs', () => {
      service.error('Error 1');
      service.warn('Warning 1');
      service.info('Info 1');

      const logs = service.getLogs();
      expect(logs.length).toBe(3);
    });

    it('should return a copy of logs array', () => {
      service.error('Test');
      const logs1 = service.getLogs();
      const logs2 = service.getLogs();

      expect(logs1).not.toBe(logs2);
      expect(logs1).toEqual(logs2);
    });
  });

  describe('getLogsByLevel()', () => {
    it('should filter logs by level', () => {
      service.error('Error 1');
      service.error('Error 2');
      service.warn('Warning 1');
      service.info('Info 1');

      const errorLogs = service.getLogsByLevel(LogLevel.ERROR);
      expect(errorLogs.length).toBe(2);
      expect(errorLogs.every(log => log.level === LogLevel.ERROR)).toBe(true);

      const warnLogs = service.getLogsByLevel(LogLevel.WARN);
      expect(warnLogs.length).toBe(1);

      const infoLogs = service.getLogsByLevel(LogLevel.INFO);
      expect(infoLogs.length).toBe(1);
    });

    it('should return empty array if no logs match level', () => {
      service.error('Error 1');

      const debugLogs = service.getLogsByLevel(LogLevel.DEBUG);
      expect(debugLogs.length).toBe(0);
    });
  });

  describe('clearLogs()', () => {
    it('should clear all logs', () => {
      service.error('Error 1');
      service.warn('Warning 1');
      service.info('Info 1');

      expect(service.getLogs().length).toBe(3);

      service.clearLogs();

      expect(service.getLogs().length).toBe(0);
    });
  });

  describe('log retention', () => {
    it('should keep only the last 100 logs', () => {
      // Log 150 messages
      for (let i = 0; i < 150; i++) {
        service.info(`Message ${i}`);
      }

      const logs = service.getLogs();
      expect(logs.length).toBe(100);

      // Should have the last 100 messages
      expect(logs[0].message).toBe('Message 50');
      expect(logs[99].message).toBe('Message 149');
    });
  });

  describe('timestamp', () => {
    it('should set timestamp for each log entry', () => {
      const beforeLog = new Date();
      service.info('Test');
      const afterLog = new Date();

      const logs = service.getLogs();
      const logTime = logs[0].timestamp;

      expect(logTime.getTime()).toBeGreaterThanOrEqual(beforeLog.getTime());
      expect(logTime.getTime()).toBeLessThanOrEqual(afterLog.getTime());
    });
  });
});
