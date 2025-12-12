import {
  tryParseSeverityLevelString,
  levelIncludes,
  getLoggingLevel,
} from "./utils/logger";
import { defaultLogger, getLogger } from "./utils/getLogger";
import type { Logger } from "./types";

export {
  tryParseSeverityLevelString,
  levelIncludes,
  getLoggingLevel,
  defaultLogger,
  getLogger,
};

export type { Logger };
