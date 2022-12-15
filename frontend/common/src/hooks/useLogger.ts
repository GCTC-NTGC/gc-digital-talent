/* eslint-disable no-console */

import { SeverityLevel, levelIncludes } from "../helpers/loggingUtils";
import { getLoggingLevel } from "../helpers/runtimeVariable";

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

const coloredConsoleLoggerLevel = getLoggingLevel("LOG_COLORED_CONSOLE_LEVEL");
const coloredConsoleStyles = "background: #222; color: #bada55";
const coloredConsoleLogger: Logger = {
  emergency: levelIncludes(coloredConsoleLoggerLevel, SeverityLevel.Emergency)
    ? (message: string) => console.error(`%c${message}`, coloredConsoleStyles)
    : noop,
  alert: levelIncludes(coloredConsoleLoggerLevel, SeverityLevel.Alert)
    ? (message: string) => console.error(`%c${message}`, coloredConsoleStyles)
    : noop,
  critical: levelIncludes(coloredConsoleLoggerLevel, SeverityLevel.Critical)
    ? (message: string) => console.error(`%c${message}`, coloredConsoleStyles)
    : noop,
  error: levelIncludes(coloredConsoleLoggerLevel, SeverityLevel.Error)
    ? (message: string) => console.error(`%c${message}`, coloredConsoleStyles)
    : noop,
  warning: levelIncludes(coloredConsoleLoggerLevel, SeverityLevel.Warning)
    ? (message: string) => console.warn(`%c${message}`, coloredConsoleStyles)
    : noop,
  notice: levelIncludes(coloredConsoleLoggerLevel, SeverityLevel.Notice)
    ? (message: string) => console.info(`%c${message}`, coloredConsoleStyles)
    : noop,
  info: levelIncludes(coloredConsoleLoggerLevel, SeverityLevel.Info)
    ? (message: string) => console.info(`%c${message}`, coloredConsoleStyles)
    : noop,
  debug: levelIncludes(coloredConsoleLoggerLevel, SeverityLevel.Debug)
    ? (message: string) => console.debug(`%c${message}`, coloredConsoleStyles)
    : noop,
};

const childLoggers: Logger[] = [consoleLogger, coloredConsoleLogger];
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
