import {
  tryParseSeverityLevelString,
  levelIncludes,
  getLoggingLevel,
} from "./utils/logger";
import useLogger, { defaultLogger } from "./hooks/useLogger";
import type { Logger } from "./types";

export {
  tryParseSeverityLevelString,
  levelIncludes,
  getLoggingLevel,
  useLogger,
  defaultLogger,
};

export type { Logger };
