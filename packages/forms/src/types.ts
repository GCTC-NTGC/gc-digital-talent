import { RegisterOptions } from "react-hook-form";

export type FieldState = "unset" | "invalid" | "dirty";

export type StyleRecord = Record<string, string>;

export type CommonInputProps = {
  /** HTML id used to identify the element. */
  id: string;
  /** Optional context which user can view by toggling a button. */
  context?: string;
  /** Holds text for the label associated with the input element */
  label: string | React.ReactNode;
  /** A string specifying a name for the input control. */
  name: string;
  /** Set of validation rules and error messages to impose on input. */
  rules?: RegisterOptions;
  /** Determine if it should track unsaved changes and render it */
  trackUnsaved?: boolean;
};
