import { getRuntimeVariable } from "@gc-digital-talent/env";

import { SeverityLevel } from "../types";

// case-insensitive compare
// https://stackoverflow.com/a/2140723
function ciEquals(a: string | undefined, b: string | undefined) {
  return typeof a === "string" && typeof b === "string"
    ? a.localeCompare(b, undefined, { sensitivity: "accent" }) === 0
    : a === b;
}

// parse a string, like from process.env, to the SeverityLevel enum
export const tryParseSeverityLevelString = (
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

// Figure out if the message should be logged given the logger cutoff level.
// More severe levels are lower numerically.
export const levelIncludes = (
  cutoffLevel: SeverityLevel | undefined,
  messageLevel: SeverityLevel,
) => cutoffLevel && messageLevel <= cutoffLevel;

/**
 * A convenience function for runtime variable logging levels
 */
export const getLoggingLevel = (name: string): SeverityLevel | undefined =>
  tryParseSeverityLevelString(getRuntimeVariable(name));
