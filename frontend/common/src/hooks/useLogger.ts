/* eslint-disable no-console */

import { SeverityLevel, levelIncludes } from "../helpers/loggingUtils";
import { getLoggingLevel } from "../helpers/runtimeVariable";
import useCustomEvent from "./useCustomEvent";

export interface Logger {
  emergency: (message: string) => void;
  alert: (message: string) => void;
  critical: (message: string) => void;
  error: (message: string) => void;
  warning: (message: string) => void;
  notice: (message: string) => void;
  info: (message: string) => void;
  debug: (message: string) => void;
}

// a no-op function for when messages won't be logged
// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {};

// A simple logger for logging to the browser console.
// Mostly useful during development.
// Controlled by setting the LOG_CONSOLE_LEVEL environment variable.
const consoleLoggerLevel = getLoggingLevel("LOG_CONSOLE_LEVEL");
const consoleLogger: Logger = {
  emergency: levelIncludes(consoleLoggerLevel, SeverityLevel.Emergency)
    ? (message: string) => console.error(message)
    : noop,
  alert: levelIncludes(consoleLoggerLevel, SeverityLevel.Alert)
    ? (message: string) => console.error(message)
    : noop,
  critical: levelIncludes(consoleLoggerLevel, SeverityLevel.Critical)
    ? (message: string) => console.error(message)
    : noop,
  error: levelIncludes(consoleLoggerLevel, SeverityLevel.Error)
    ? (message: string) => console.error(message)
    : noop,
  warning: levelIncludes(consoleLoggerLevel, SeverityLevel.Warning)
    ? (message: string) => console.warn(message)
    : noop,
  notice: levelIncludes(consoleLoggerLevel, SeverityLevel.Notice)
    ? (message: string) => console.info(message)
    : noop,
  info: levelIncludes(consoleLoggerLevel, SeverityLevel.Info)
    ? (message: string) => console.info(message)
    : noop,
  debug: levelIncludes(consoleLoggerLevel, SeverityLevel.Debug)
    ? (message: string) => console.debug(message)
    : noop,
};

// A logger for logging to the Azure Application Insights custom events.
// Only useful when deployed on an Azure server.
// Controlled by setting the LOG_APPLICATIONINSIGHTS_LEVEL environment variable.
const aiLoggerLevel = getLoggingLevel("LOG_APPLICATIONINSIGHTS_LEVEL");
const aiLogger: Logger = {
  emergency: levelIncludes(aiLoggerLevel, SeverityLevel.Emergency)
    ? (message: string) => useCustomEvent("EMERGENCY", { message })
    : noop,
  alert: levelIncludes(aiLoggerLevel, SeverityLevel.Alert)
    ? (message: string) => useCustomEvent("ALERT", { message })
    : noop,
  critical: levelIncludes(aiLoggerLevel, SeverityLevel.Critical)
    ? (message: string) => useCustomEvent("CRITICAL", { message })
    : noop,
  error: levelIncludes(aiLoggerLevel, SeverityLevel.Error)
    ? (message: string) => useCustomEvent("ERROR", { message })
    : noop,
  warning: levelIncludes(aiLoggerLevel, SeverityLevel.Warning)
    ? (message: string) => useCustomEvent("WARNING", { message })
    : noop,
  notice: levelIncludes(aiLoggerLevel, SeverityLevel.Notice)
    ? (message: string) => useCustomEvent("NOTICE", { message })
    : noop,
  info: levelIncludes(aiLoggerLevel, SeverityLevel.Info)
    ? (message: string) => useCustomEvent("INFO", { message })
    : noop,
  debug: levelIncludes(aiLoggerLevel, SeverityLevel.Debug)
    ? (message: string) => useCustomEvent("DEBUG", { message })
    : noop,
};

const childLoggers: Logger[] = [consoleLogger, aiLogger];
const stackLogger: Logger = {
  emergency: (message: string) =>
    childLoggers.forEach((l) => l.emergency(message)),
  alert: (message: string) => childLoggers.forEach((l) => l.alert(message)),
  critical: (message: string) =>
    childLoggers.forEach((l) => l.critical(message)),
  error: (message: string) => childLoggers.forEach((l) => l.error(message)),
  warning: (message: string) => childLoggers.forEach((l) => l.warning(message)),
  notice: (message: string) => childLoggers.forEach((l) => l.notice(message)),
  info: (message: string) => childLoggers.forEach((l) => l.info(message)),
  debug: (message: string) => childLoggers.forEach((l) => l.debug(message)),
};
export { stackLogger as defaultLogger };

/**
 * A hook version of logger.
 * @returns Logger
 */
export const useLogger = (): Logger => {
  return stackLogger;
};
