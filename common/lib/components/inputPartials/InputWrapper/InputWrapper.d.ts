import React from "react";
export interface InputWrapperProps {
    inputId: string;
    label: string;
    required: boolean;
    error?: string;
    errorPosition?: "top" | "bottom";
    context?: string;
    hideOptional?: boolean;
}
export declare const InputWrapper: React.FC<InputWrapperProps>;
export default InputWrapper;
