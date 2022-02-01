import * as React from "react";
import { RegisterOptions } from "react-hook-form";
export declare type Radio = {
    value: string | number;
    label: string;
};
export interface RadioGroupProps {
    /** Each input element will be given an id to match to its label, of the form `${idPrefix}-${value}` */
    idPrefix: string;
    /** Holds text for the legend associated with the RadioGroup fieldset. */
    legend: string;
    /** The name of this form control.
     * The form's value at this key should be of type Array<string|number>. */
    name: string;
    /** A list of value and label representing the Radios shown.
     * The form will represent the data at `name` as a string containing the chosen value. */
    items: Radio[];
    /** Set of validation rules and error messages to impose on all input elements. */
    rules?: RegisterOptions;
    /** If a context string is provided, a small button will appear which, when toggled, shows the context string below the inputs. */
    context?: string;
    /** If true, all input elements in this fieldset will be disabled. */
    disabled?: boolean;
    /** If true, and this input is not required, 'Optional' will not be shown above the fieldset. */
    hideOptional?: boolean;
    /** If set to the value of an input element that element will start selected */
    defaultSelected?: string;
}
/**
 * Must be part of a form controlled by react-hook-form.
 * The form will represent the data at `name` as an array, containing the values of the checked boxes.
 */
export declare const RadioGroup: React.FunctionComponent<RadioGroupProps>;
export default RadioGroup;
