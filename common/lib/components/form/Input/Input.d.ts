import * as React from "react";
import { RegisterOptions } from "react-hook-form";
export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "capture" | "type"> {
    /** HTML id used to identify the element. */
    id: string;
    /** Optional context which user can view by toggling a button. */
    context?: string;
    /** Holds text for the label associated with the input element */
    label: string;
    /** A string specifying a name for the input control. */
    name: string;
    /** Set of validation rules and error messages to impose on input. */
    rules?: RegisterOptions;
    /** Set the type of the input. */
    type: "text" | "number" | "email" | "tel" | "password" | "date" | "search";
    /** If input is not required, hide the 'Optional' label */
    hideOptional?: boolean;
    errorPosition?: "top" | "bottom";
}
export declare const Input: React.FunctionComponent<InputProps>;
export default Input;
