import {
  DetailedHTMLProps,
  InputHTMLAttributes,
  FieldsetHTMLAttributes,
  ReactNode,
} from "react";
import {
  RegisterOptions,
  FieldError,
  FieldErrorsImpl,
  Merge,
} from "react-hook-form";

export type FieldLabels = Record<string, ReactNode>;

export type FieldState = "unset" | "invalid" | "dirty";

export type StyleRecord = Record<string, string>;

export type HTMLInputProps = Omit<
  DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
  "capture" | "type"
>;

export type HTMLFieldsetProps = Omit<
  DetailedHTMLProps<
    FieldsetHTMLAttributes<HTMLFieldSetElement>,
    HTMLFieldSetElement
  >,
  "ref"
>;

export interface CommonInputProps {
  /** HTML id used to identify the element. */
  id: string;
  /** Optional context which user can view by toggling a button. */
  context?: string | ReactNode;
  /** Holds text for the label associated with the input element */
  label: string | ReactNode;
  /** A string specifying a name for the input control. */
  name: string;
  /** Set of validation rules and error messages to impose on input. */
  rules?: RegisterOptions;
  /** Determine if it should track unsaved changes and render it */
  trackUnsaved?: boolean;
}

export type InputFieldError =
  | string
  | FieldError
  // This is from `react-hook-form` so ignore the any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  | Merge<FieldError, FieldErrorsImpl<any>>
  | undefined;

export interface Option {
  label: ReactNode;
  value: string | number;
  disabled?: boolean;
  options?: Option[];
  /** Aria labels for alternate text that will be read by assistive technologies. */
  ariaLabel?: string;
}
export interface OptGroup {
  label: ReactNode;
  options: Option[];
  disabled?: boolean;
  value: string | number;
  /** Aria labels for alternate text that will be read by assistive technologies. */
  ariaLabel?: string;
}

export type OptGroupOrOption = OptGroup | Option;
