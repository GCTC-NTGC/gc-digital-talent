import React from "react";
import { RegisterOptions } from "react-hook-form";
export declare type Option = {
    value: string | number;
    label: string;
};
interface MultiSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    /** HTML id used to identify the element. */
    id: string;
    /** Optional context which user can view by toggling a button. */
    context?: string;
    /** The text for the label associated with the select input. */
    label: string;
    /** A string specifying a name for the input control. */
    name: string;
    /** List of options for the select element. */
    options: Option[];
    /** Object set of validation rules to impose on input. */
    rules?: RegisterOptions;
    /** Default message shown on select input */
    placeholder?: string;
}
export declare const MultiSelect: React.FunctionComponent<MultiSelectProps>;
export default MultiSelect;
