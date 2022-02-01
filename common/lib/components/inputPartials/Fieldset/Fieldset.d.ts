import React from "react";
export interface FieldsetProps {
    /** The text for the legend element. */
    legend: string;
    /** The name of this form control. */
    name?: string;
    /** Controls whether Required or Optional text appears above the fieldset. */
    required?: boolean;
    /** If an error string is provided, it will appear below the fieldset inputs. */
    error?: string;
    /** If a context string is provided, a small button will appear which, when toggled, shows the context string. */
    context?: string;
    /** If true, all input elements in this fieldset will be disabled. */
    disabled?: boolean;
    /** If true, and required is false, 'Optional' will not be shown above the fieldset. */
    hideOptional?: boolean;
}
export declare const Fieldset: React.FC<FieldsetProps>;
export default Fieldset;
