/**
 * @license
 * Copyright 2025 Jack Ruder
 * Licensed under the Apache License, Version 2.0 (the "License");
 */

// Enhanced logging system with type-safe custom methods and PostHog integration
// Provides comprehensive logging with clean .c.methodName() syntax

import env from "#env";
import chalk from "chalk";
import posthog from "posthog-js";

export type LogLevel = "off" | "prod" | "debug";
export type LogMethod =
  | "start"
  | "end"
  | "trace"
  | "error"
  | "warn"
  | "info"
  | "log"
  | "debug"
  | "success"
  | "fail"
  | "fatal"
  | "die";

export interface LoggerCustomization {
  methodColors?: Partial<Record<LogMethod, (text: string) => string>>;
  typeColors?: Record<string, (text: string) => string>;
  customMethods?: Record<
    string,
    {
      color: (text: string) => string;
      type: string;
    }
  >;
}

export interface ILogger {
  start(message: string): void;
  end(message: string): void;
  trace(message: string): void;
  error(message: string): void;
  warn(message: string): void;
  info(message: string): void;
  log(message: string): void;
  debug(message: string): void;
  success(message: string): void;
  fail(message: string): void;
  fatal(message: string): void;
  die(message: string): void;
  custom(method: string, type: string, message: string): void;
}

// Type mapping for custom methods with .c. syntax
type CustomMethodsProxy<
  T extends Record<string, { color: (text: string) => string; type: string }>,
> = {
  [K in keyof T]: (message: string) => void;
};

const LOG_LEVEL_HIERARCHY: Record<LogLevel, LogMethod[]> = {
  off: [], // Nothing gets logged
  prod: ["error", "fatal", "die"], // Only errors and fatal in production
  debug: [
    "start",
    "end",
    "trace",
    "error",
    "warn",
    "info",
    "log",
    "debug",
    "success",
    "fail",
    "fatal",
    "die",
  ], // Everything in debug
};

export class Logger<
  TCustomMethods extends Record<
    string,
    { color: (text: string) => string; type: string }
  > = Record<string, never>,
> implements ILogger
{
  private functionName: string;
  private customization: LoggerCustomization;
  private logLevel: LogLevel;
  private parent?: Logger<
    Record<string, { color: (text: string) => string; type: string }>
  >;

  // Default method colors
  private static defaultMethodColors: Record<
    LogMethod,
    (text: string) => string
  > = {
    start: chalk.green,
    end: chalk.green,
    trace: chalk.gray,
    error: chalk.red,
    warn: chalk.yellow,
    info: chalk.blue,
    log: chalk.white,
    debug: chalk.cyan,
    success: chalk.green,
    fail: chalk.red,
    fatal: chalk.redBright,
    die: chalk.redBright,
  };

  // Default type colors
  private static defaultTypeColors: Record<string, (text: string) => string> = {
    ERROR: chalk.red,
    WARN: chalk.yellow,
    INFO: chalk.blue,
    DEBUG: chalk.cyan,
    SUCCESS: chalk.green,
    FAIL: chalk.red,
    FATAL: chalk.redBright,
    START: chalk.green,
    END: chalk.green,
    TRACE: chalk.gray,
  };

  // Custom methods proxy for .c. syntax
  public readonly c: CustomMethodsProxy<TCustomMethods>;

  // Constructor overloads for flexibility
  constructor(functionName: string);
  constructor(functionName: string, logLevel: LogLevel);
  constructor(
    functionName: string,
    customization: LoggerCustomization & { customMethods: TCustomMethods },
  );
  constructor(
    functionName: string,
    logLevel: LogLevel,
    customization: LoggerCustomization & { customMethods: TCustomMethods },
  );
  constructor(
    functionName: string,
    logLevelOrCustomization?:
      | LogLevel
      | (LoggerCustomization & { customMethods: TCustomMethods }),
    customization?: LoggerCustomization & { customMethods: TCustomMethods },
  ) {
    this.functionName = functionName;

    // Handle constructor overloads
    if (typeof logLevelOrCustomization === "string") {
      this.logLevel = logLevelOrCustomization;
      this.customization = customization ?? {
        customMethods: {} as TCustomMethods,
      };
    } else if (
      logLevelOrCustomization &&
      typeof logLevelOrCustomization === "object"
    ) {
      this.logLevel = "debug";
      this.customization = logLevelOrCustomization;
    } else {
      this.logLevel = "debug";
      this.customization = { customMethods: {} as TCustomMethods };
    }

    // Create custom methods proxy for .c. syntax
    this.c = new Proxy({} as CustomMethodsProxy<TCustomMethods>, {
      get: (target, prop: string) => {
        return (message: string) => {
          const customMethod = this.customization.customMethods?.[prop];
          if (customMethod) {
            this.custom(prop, customMethod.type, message);
          } else {
            // Fallback for methods not in customMethods
            this.custom(prop, "CUSTOM", message);
          }
        };
      },
    });
  }

  // Static method to create extended loggers with parent-child relationships
  static extend<
    TCustomMethods extends Record<
      string,
      { color: (text: string) => string; type: string }
    >,
  >(
    parent: Logger<
      Record<string, { color: (text: string) => string; type: string }>
    >,
    childName: string,
    customMethods?: TCustomMethods,
  ): Logger<TCustomMethods> {
    const fullName = `${parent.functionName}:${childName}`;
    const childCustomization: LoggerCustomization & {
      customMethods: TCustomMethods;
    } = {
      ...parent.customization,
      customMethods: customMethods ?? ({} as TCustomMethods),
    };

    const child = new Logger(fullName, parent.logLevel, childCustomization);
    child.parent = parent;
    return child;
  }

  private shouldLog(method: LogMethod): boolean {
    if (this.logLevel === "off") return false;
    return LOG_LEVEL_HIERARCHY[this.logLevel].includes(method);
  }

  private formatLog(method: LogMethod, message: string): string {
    const timestamp = chalk.red(new Date().toISOString());
    const funcName = chalk.cyan(`[${this.functionName}]`);
    const methodName = chalk.blue(`[${method.toUpperCase()}]`);

    // Get type color
    const typeColor =
      this.customization.typeColors?.[method.toUpperCase()] ??
      Logger.defaultTypeColors[method.toUpperCase()] ??
      chalk.white;

    const typeTag = typeColor(`[${method.toUpperCase()}]`);
    const messageText = chalk.white(message);

    return `${timestamp} ${funcName} ${methodName} ${typeTag} ${messageText}`;
  }

  private formatCustomLog(
    method: string,
    type: string,
    message: string,
  ): string {
    // Custom methods are only logged in debug mode
    if (this.logLevel !== "debug") return "";

    const timestamp = chalk.red(new Date().toISOString());
    const funcName = chalk.cyan(`[${this.functionName}]`);
    const methodName = chalk.blue(`[${method.toUpperCase()}]`);

    // Get custom method color or default
    const customMethod = this.customization.customMethods?.[method];
    const typeColor = customMethod?.color ?? chalk.white;

    const typeTag = typeColor(`[${type.toUpperCase()}]`);
    const messageText = chalk.white(message);

    return `${timestamp} ${funcName} ${methodName} ${typeTag} ${messageText}`;
  }

  private async sendToPostHog(method: string, message: string): Promise<void> {
    // Only send to PostHog if we're in a browser environment and PostHog is available
    if (typeof window === "undefined" || !posthog.__loaded) {
      return;
    }

    try {
      // Map log methods to PostHog events
      switch (method) {
        case "error":
        case "fatal":
        case "die":
          // Capture exceptions for error-level logs
          posthog.captureException(new Error(message), {
            logger_name: this.functionName,
            log_level: method,
            log_message: message,
          });
          break;

        case "warn":
        case "fail":
          // Capture warnings as events
          posthog.capture("logger_warning", {
            logger_name: this.functionName,
            log_level: method,
            log_message: message,
          });
          break;

        case "success":
        case "info":
          // Capture informational events (only in debug mode to avoid spam)
          if (this.logLevel === "debug") {
            posthog.capture("logger_info", {
              logger_name: this.functionName,
              log_level: method,
              log_message: message,
            });
          }
          break;

        default:
          // For custom methods, capture as generic logger events (debug mode only)
          if (this.logLevel === "debug") {
            posthog.capture("logger_custom", {
              logger_name: this.functionName,
              log_method: method,
              log_message: message,
            });
          }
          break;
      }
    } catch (error) {
      // Fail silently to avoid breaking the logging system
      console.warn("Failed to send log to PostHog:", error);
    }
  }

  start(message: string): void {
    if (!this.shouldLog("start")) return;
    console.log(this.formatLog("start", message));
    void this.sendToPostHog("start", message);
  }

  end(message: string): void {
    if (!this.shouldLog("end")) return;
    console.log(this.formatLog("end", message));
    void this.sendToPostHog("end", message);
  }

  trace(message: string): void {
    if (!this.shouldLog("trace")) return;
    console.trace(this.formatLog("trace", message));
    void this.sendToPostHog("trace", message);
  }

  error(message: string): void {
    if (!this.shouldLog("error")) return;
    console.error(this.formatLog("error", message));
    void this.sendToPostHog("error", message);
  }

  warn(message: string): void {
    if (!this.shouldLog("warn")) return;
    console.warn(this.formatLog("warn", message));
    void this.sendToPostHog("warn", message);
  }

  info(message: string): void {
    if (!this.shouldLog("info")) return;
    console.info(this.formatLog("info", message));
    void this.sendToPostHog("info", message);
  }

  log(message: string): void {
    if (!this.shouldLog("log")) return;
    console.log(this.formatLog("log", message));
    void this.sendToPostHog("log", message);
  }

  debug(message: string): void {
    if (!this.shouldLog("debug")) return;
    console.debug(this.formatLog("debug", message));
    void this.sendToPostHog("debug", message);
  }

  success(message: string): void {
    if (!this.shouldLog("success")) return;
    console.log(this.formatLog("success", message));
    void this.sendToPostHog("success", message);
  }

  fail(message: string): void {
    if (!this.shouldLog("fail")) return;
    console.error(this.formatLog("fail", message));
    void this.sendToPostHog("fail", message);
  }

  fatal(message: string): void {
    if (!this.shouldLog("fatal")) return;
    console.error(this.formatLog("fatal", message));
    void this.sendToPostHog("fatal", message);
  }

  die(message: string): void {
    if (this.shouldLog("die")) {
      console.error(this.formatLog("die", message));
      void this.sendToPostHog("die", message);
    }
  }

  custom(method: string, type: string, message: string): void {
    const formatted = this.formatCustomLog(method, type, message);
    if (formatted) {
      console.log(formatted);
      void this.sendToPostHog(method, message);
    }
  }

  // Method to change log level at runtime
  setLogLevel(level: LogLevel): void {
    this.logLevel = level;
  }

  getLogLevel(): LogLevel {
    return this.logLevel;
  }

  // Get the full logger hierarchy path
  getPath(): string {
    if (this.parent) {
      return `${this.parent.getPath()} → ${this.functionName}`;
    }
    return this.functionName;
  }
}

// Specialized logger for function entry/exit
export class FunctionLogger<
  TCustomMethods extends Record<
    string,
    { color: (text: string) => string; type: string }
  > = Record<string, never>,
> extends Logger<TCustomMethods> {
  constructor(
    functionName: string,
    logLevel: LogLevel = defaultLogLevel,
    customization?: LoggerCustomization & { customMethods: TCustomMethods },
  ) {
    super(
      `fn:${functionName}`,
      logLevel,
      customization ?? { customMethods: {} as TCustomMethods },
    );
  }

  enter(args?: unknown[]): void {
    const argsStr = args ? ` with args: ${JSON.stringify(args)}` : "";
    this.start(`Entering function${argsStr}`);
  }

  exit(result?: unknown): void {
    const resultStr =
      result !== undefined ? ` with result: ${JSON.stringify(result)}` : "";
    this.end(`Exiting function${resultStr}`);
  }

  step(step: string, data?: unknown): void {
    const dataStr = data !== undefined ? ` - ${JSON.stringify(data)}` : "";
    this.debug(`${step}${dataStr}`);
  }
}

// Specialized logger for error recovery scenarios
export class RecoveryLogger<
  TCustomMethods extends Record<
    string,
    { color: (text: string) => string; type: string }
  > = Record<string, never>,
> extends Logger<TCustomMethods> {
  constructor(
    context: string,
    logLevel: LogLevel = defaultLogLevel,
    customization?: LoggerCustomization & { customMethods: TCustomMethods },
  ) {
    super(
      `recovery:${context}`,
      logLevel,
      customization ?? { customMethods: {} as TCustomMethods },
    );
  }

  attempt(operation: string, attemptNumber: number): void {
    this.info(`Attempt ${attemptNumber}: ${operation}`);
  }

  recover(error: Error, fallback: string): void {
    this.warn(
      `Recovered from error: ${error.message}. Using fallback: ${fallback}`,
    );
  }

  giveUp(error: Error, attempts: number): void {
    this.fatal(
      `Failed after ${attempts} attempts. Final error: ${error.message}`,
    );
  }
}

// Determine log level from environment
function getLogLevelFromEnv(): LogLevel {
  return env.LOG_LEVEL ?? "prod";
}

export const defaultLogLevel = getLogLevelFromEnv();

// Utility function to create a logger with custom settings
export function createLogger<
  TCustomMethods extends Record<
    string,
    { color: (text: string) => string; type: string }
  > = Record<string, never>,
>(
  functionName: string,
  logLevel: LogLevel = defaultLogLevel,
  customization?: LoggerCustomization & { customMethods: TCustomMethods },
): Logger<TCustomMethods> {
  return new Logger(
    functionName,
    logLevel,
    customization ?? { customMethods: {} as TCustomMethods },
  );
}
