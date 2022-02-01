import React from "react";
import { RegisterOptions } from "react-hook-form";
export interface CheckboxProps extends Omit<React.HTMLProps<HTMLInputElement>, "capture" | "type"> {
    /** HTML id used to identify the element. */
    id: string;
    /** Holds text for the label associated with the input element */
    label: string;
    /** A string specifying a name for the input control. */
    name: string;
    /** Set of validation rules and error messages to impose on input. */
    rules?: RegisterOptions;
    /** Optional context which user can view by toggling a button. */
    context?: string;
}
export declare const Checkbox: React.FunctionComponent<CheckboxProps>;
export default Checkbox;
