import * as React from "react";
import { RegisterOptions } from "react-hook-form";
export interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
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
}
export declare const TextArea: React.FunctionComponent<TextAreaProps>;
export default TextArea;
