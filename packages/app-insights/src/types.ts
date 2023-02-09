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
