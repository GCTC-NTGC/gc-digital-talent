import React from "react";

import { HTMLInputProps } from "../../types";

export interface Option {
  /** The data used on form submission  */
  value: string;
  /** Text to display in the list of options */
  label: React.ReactNode;
}

export type DefaultValues =
  | Readonly<{
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      [x: string]: any;
    }>
  | undefined;

export type Selected = string | string[];

export type BaseProps = {
  options: Option[];
  isRequired?: boolean;
  label: React.ReactNode;
  inputProps?: HTMLInputProps;
  value?: Option;
};
