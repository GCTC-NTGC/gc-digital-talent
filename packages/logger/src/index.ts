import type { Logger } from "./types";
import { defaultLogger, getLogger } from "./utils/getLogger";
import {
  tryParseSeverityLevelString,
  levelIncludes,
  getLoggingLevel,
} from "./utils/logger";

export {
  tryParseSeverityLevelString,
  levelIncludes,
  getLoggingLevel,
  defaultLogger,
  getLogger,
};

export type { Logger };
