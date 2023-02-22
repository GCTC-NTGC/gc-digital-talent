/* eslint-disable no-console */
import { reactPlugin } from "@gc-digital-talent/app-insights";

import { SeverityLevel, Logger } from "../types";
import { getLoggingLevel, levelIncludes } from "../utils/logger";

// A simple logger for logging to the browser console.
// Mostly useful during development.
// Controlled by setting the LOG_CONSOLE_LEVEL environment variable.
const consoleLoggerLevel = getLoggingLevel("LOG_CONSOLE_LEVEL");
const consoleLogger: Logger = {
  emergency: (message: string) => {
    if (levelIncludes(consoleLoggerLevel, SeverityLevel.Emergency))
      console.error(message);
  },
  alert: (message: string) => {
    if (levelIncludes(consoleLoggerLevel, SeverityLevel.Alert))
      console.error(message);
  },
  critical: (message: string) => {
    if (levelIncludes(consoleLoggerLevel, SeverityLevel.Critical))
      console.error(message);
  },
  error: (message: string) => {
    if (levelIncludes(consoleLoggerLevel, SeverityLevel.Error))
      console.error(message);
  },
  warning: (message: string) => {
    if (levelIncludes(consoleLoggerLevel, SeverityLevel.Warning))
      console.warn(message);
  },
  notice: (message: string) => {
    if (levelIncludes(consoleLoggerLevel, SeverityLevel.Notice))
      console.info(message);
  },
  info: (message: string) => {
    if (levelIncludes(consoleLoggerLevel, SeverityLevel.Info))
      console.info(message);
  },
  debug: (message: string) => {
    if (levelIncludes(consoleLoggerLevel, SeverityLevel.Debug))
      console.debug(message);
  },
};

// A logger for logging to the Azure Application Insights custom events.
// Only useful when deployed on an Azure server.
// Controlled by setting the LOG_APPLICATIONINSIGHTS_LEVEL environment variable.
const aiLoggerLevel = getLoggingLevel("LOG_APPLICATIONINSIGHTS_LEVEL");
const applicationInsightsLogger: Logger = {
  emergency: (message: string) => {
    if (levelIncludes(aiLoggerLevel, SeverityLevel.Emergency))
      reactPlugin.trackEvent({ name: "Emergency" }, { message });
  },
  alert: (message: string) => {
    if (levelIncludes(aiLoggerLevel, SeverityLevel.Alert))
      reactPlugin.trackEvent({ name: "Alert" }, { message });
  },
  critical: (message: string) => {
    if (levelIncludes(aiLoggerLevel, SeverityLevel.Critical))
      reactPlugin.trackEvent({ name: "Critical" }, { message });
  },
  error: (message: string) => {
    if (levelIncludes(aiLoggerLevel, SeverityLevel.Error))
      reactPlugin.trackEvent({ name: "Error" }, { message });
  },
  warning: (message: string) => {
    if (levelIncludes(aiLoggerLevel, SeverityLevel.Warning))
      reactPlugin.trackEvent({ name: "Warning" }, { message });
  },
  notice: (message: string) => {
    if (levelIncludes(aiLoggerLevel, SeverityLevel.Notice))
      reactPlugin.trackEvent({ name: "Notice" }, { message });
  },
  info: (message: string) => {
    if (levelIncludes(aiLoggerLevel, SeverityLevel.Info))
      reactPlugin.trackEvent({ name: "Info" }, { message });
  },
  debug: (message: string) => {
    if (levelIncludes(aiLoggerLevel, SeverityLevel.Debug))
      reactPlugin.trackEvent({ name: "Debug" }, { message });
  },
};

// A logger that sends all messages to the child loggers.
// Logging by child loggers is controlled by the level settings of each child logger.
const childLoggers: Logger[] = [consoleLogger, applicationInsightsLogger];
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
const useLogger = (): Logger => {
  return stackLogger;
};

export default useLogger;
