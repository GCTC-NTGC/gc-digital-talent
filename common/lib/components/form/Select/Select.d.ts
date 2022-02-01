import React from "react";
import { RegisterOptions } from "react-hook-form";
export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    /** HTML id used to identify the element. */
    id: string;
    /** The text for the label associated with the select input. */
    label: string;
    /** A string specifying a name for the input control. */
    name: string;
    /** List of options for the select element. */
    options: {
        value: string | number;
        label: string;
        disabled?: boolean;
    }[];
    /** Object set of validation rules to impose on input. */
    rules?: RegisterOptions;
    /** Optional context which user can view by toggling a button. */
    context?: string;
    /** Null selection string provides a null value with instructions to user (eg. Select a department...) */
    nullSelection?: string;
}
export declare const Select: React.FunctionComponent<SelectProps>;
export default Select;
