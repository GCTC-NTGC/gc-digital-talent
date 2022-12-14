// https://www.rfc-editor.org/rfc/rfc5424
export enum SeverityLevel {
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
