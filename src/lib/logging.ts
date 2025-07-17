/**
 * @license
 * Copyright 2025 Jack Ruder
 * Licensed under the Apache License, Version 2.0 (the "License");
 */

// This file serves the purpose of providing usefull wrappers around console.log
// This is at first dedicated to scripts and middleware, posthog stuff may be implemented later

import env from "#env";
import chalk from "chalk";

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

export class Logger implements ILogger {
  private functionName: string;
  private customization: LoggerCustomization;
  private logLevel: LogLevel;

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

  constructor(
    functionName: string,
    logLevel: LogLevel = "debug",
    customization?: LoggerCustomization,
  ) {
    this.functionName = functionName;
    this.logLevel = logLevel;
    this.customization = customization ?? {};
  }

  private shouldLog(method: LogMethod): boolean {
    if (this.logLevel === "off") return false;
    return LOG_LEVEL_HIERARCHY[this.logLevel].includes(method);
  }

  private formatLog(method: LogMethod, message: string): string {
    const timestamp = chalk.red(new Date().toISOString());
    const funcName = chalk.cyan(`[${this.functionName}]`);
    const methodName = chalk.blue(`[${method.toUpperCase()}]`);

    // Get method color
    const methodColor =
      this.customization.methodColors?.[method] ??
      Logger.defaultMethodColors[method];

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

  start(message: string): void {
    if (!this.shouldLog("start")) return;
    console.log(this.formatLog("start", message));
  }

  end(message: string): void {
    if (!this.shouldLog("end")) return;
    console.log(this.formatLog("end", message));
  }

  trace(message: string): void {
    if (!this.shouldLog("trace")) return;
    console.trace(this.formatLog("trace", message));
  }

  error(message: string): void {
    if (!this.shouldLog("error")) return;
    console.error(this.formatLog("error", message));
  }

  warn(message: string): void {
    if (!this.shouldLog("warn")) return;
    console.warn(this.formatLog("warn", message));
  }

  info(message: string): void {
    if (!this.shouldLog("info")) return;
    console.info(this.formatLog("info", message));
  }

  log(message: string): void {
    if (!this.shouldLog("log")) return;
    console.log(this.formatLog("log", message));
  }

  debug(message: string): void {
    if (!this.shouldLog("debug")) return;
    console.debug(this.formatLog("debug", message));
  }

  success(message: string): void {
    if (!this.shouldLog("success")) return;
    console.log(this.formatLog("success", message));
  }

  fail(message: string): void {
    if (!this.shouldLog("fail")) return;
    console.error(this.formatLog("fail", message));
  }

  fatal(message: string): void {
    if (!this.shouldLog("fatal")) return;
    console.error(this.formatLog("fatal", message));
  }

  die(message: string): void {
    if (this.shouldLog("die")) {
      console.error(this.formatLog("die", message));
    }
  }

  custom(method: string, type: string, message: string): void {
    const formatted = this.formatCustomLog(method, type, message);
    if (formatted) {
      console.log(formatted);
    }
  }

  // Method to change log level at runtime
  setLogLevel(level: LogLevel): void {
    this.logLevel = level;
  }

  getLogLevel(): LogLevel {
    return this.logLevel;
  }
}

// Determine log level from environment
function getLogLevelFromEnv(): LogLevel {
  return env.LOG_LEVEL ?? "prod";
}

export const defaultLogLevel = getLogLevelFromEnv();

// Utility function to create a logger with custom settings
export function createLogger(
  functionName: string,
  logLevel: LogLevel = defaultLogLevel,
  customization?: LoggerCustomization,
): Logger {
  return new Logger(functionName, logLevel, customization);
}
