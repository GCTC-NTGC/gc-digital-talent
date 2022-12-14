/* eslint-disable no-console */
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

// https://www.rfc-editor.org/rfc/rfc5424
enum SeverityLevel {
  Emergency = 0, // system is unusable
  Alert = 1, // action must be taken immediately
  Critical = 2, // critical conditions
  Error = 3, // error conditions
  Warning = 4, // warning conditions
  Notice = 5, // normal but significant condition
  Info = 6, // informational messages
  Debug = 7, // debug-level messages
}

// case-insensitive compare
// https://stackoverflow.com/a/2140723
function ciEquals(a: string | undefined, b: string | undefined) {
  return typeof a === "string" && typeof b === "string"
    ? a.localeCompare(b, undefined, { sensitivity: "accent" }) === 0
    : a === b;
}

// parse a string, like from process.env, to the SeverityLevel enum
const tryParseSeverityLevelString = (
  s: string | undefined,
): SeverityLevel | undefined => {
  if (ciEquals(s, "Emergency")) return SeverityLevel.Emergency;
  if (ciEquals(s, "Alert")) return SeverityLevel.Alert;
  if (ciEquals(s, "Critical")) return SeverityLevel.Critical;
  if (ciEquals(s, "Error")) return SeverityLevel.Error;
  if (ciEquals(s, "Warning")) return SeverityLevel.Warning;
  if (ciEquals(s, "Notice")) return SeverityLevel.Notice;
  if (ciEquals(s, "Info")) return SeverityLevel.Info;
  if (ciEquals(s, "Informational")) return SeverityLevel.Info;
  if (ciEquals(s, "Debug")) return SeverityLevel.Debug;
  return undefined;
};

// a no-op function for when messages won't be logged
// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {};

// figure out if the message should be logged given the logger level
const levelIncludes = (
  cutoffLevel: SeverityLevel | undefined,
  messageLevel: SeverityLevel,
) => cutoffLevel && messageLevel <= cutoffLevel;

const consoleLoggerLevel = tryParseSeverityLevelString(
  process.env.LOG_CONSOLE_LEVEL,
);
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

const coloredConsoleLoggerLevel = tryParseSeverityLevelString(
  process.env.LOG_COLORED_CONSOLE_LEVEL,
);
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
    childLoggers.forEach((logger) => logger.emergency(message)),
  alert: (message: string) =>
    childLoggers.forEach((logger) => logger.alert(message)),
  critical: (message: string) =>
    childLoggers.forEach((logger) => logger.critical(message)),
  error: (message: string) =>
    childLoggers.forEach((logger) => logger.error(message)),
  warning: (message: string) =>
    childLoggers.forEach((logger) => logger.warning(message)),
  notice: (message: string) =>
    childLoggers.forEach((logger) => logger.notice(message)),
  info: (message: string) =>
    childLoggers.forEach((logger) => logger.info(message)),
  debug: (message: string) =>
    childLoggers.forEach((logger) => logger.debug(message)),
};

export default consoleLogger;

/**
 * A hook version of logger.
 * @returns Logger
 */
export const useLogger = (): Logger => {
  return stackLogger;
};
