import {
  DetailedHTMLProps,
  InputHTMLAttributes,
  FieldsetHTMLAttributes,
  ReactNode,
  JSX,
} from "react";
import {
  RegisterOptions,
  FieldError,
  FieldErrorsImpl,
  Merge,
} from "react-hook-form";

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

export type CommonInputProps = {
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
};

export type InputFieldError =
  | string
  | FieldError
  // This is from `react-hook-form` so ignore the any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  | Merge<FieldError, FieldErrorsImpl<any>>
  | undefined;

export type Option = {
  label: ReactNode;
  value: string | number;
  disabled?: boolean;
  options?: Option[];
  /** Aria labels for alternate text that will be read by assistive technologies. */
  ariaLabel?: string;
};
export type OptGroup = {
  label: ReactNode;
  options: Option[];
  disabled?: boolean;
  value: string | number;
  /** Aria labels for alternate text that will be read by assistive technologies. */
  ariaLabel?: string;
};

export type OptGroupOrOption = OptGroup | Option;

export type FieldLabels = Record<string, ReactNode>;

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Attrs {
  readonly [attr: string]: any;
}

export interface Node {
  type: string;
  attrs?: Attrs;
  marks?: Attrs[];
  content?: Node[];
  readonly [attr: string]: any;
}

export interface NodeProps {
  children?: ReactNode;
  node: Node;
}

export type NodeRenderer = (props: NodeProps) => JSX.Element;

export interface RenderMap {
  readonly [attr: string]: NodeRenderer;
}
