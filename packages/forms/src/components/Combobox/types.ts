import { ReactNode, DetailedHTMLProps, HTMLAttributes } from "react";

import { FieldState, HTMLInputProps } from "../../types";

export type ComboboxValue = string | (string | undefined)[] | undefined;

export interface Option {
  /** The data used on form submission  */
  value: string | number;
  /** Text to display in the list of options */
  label: string;
}

export type HTMLSpanProps = Omit<
  DetailedHTMLProps<HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>,
  "ref"
>;

export interface BaseProps {
  /** All available options */
  options: Option[];
  /** If this input is required or not */
  isRequired?: boolean;
  /** Label for the input */
  label: ReactNode;
  /** Props to pass to the HTML `input` */
  inputProps?: HTMLInputProps;
  /** Optional: Set if the options are being fetched */
  fetching?: boolean;
  /** Optional: Control the options through external search (API, etc.) */
  isExternalSearch?: boolean;
  /** Button text to clear the current text from the input (optional) */
  clearLabel?: string;
  /** Button text to toggle the options menu (optional) */
  toggleLabel?: string;
  /** Optional: Total number available options (use for API driven where options is not the total length) */
  total: number;
  /** Current state of the input */
  fieldState?: FieldState;
}
