import {
  DetailedHTMLProps,
  InputHTMLAttributes,
  FieldsetHTMLAttributes,
  ReactNode,
} from "react";
import { RegisterOptions } from "react-hook-form";

export type FieldLabels = Record<string, ReactNode>;

export type FieldState = "unset" | "invalid" | "dirty";

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
