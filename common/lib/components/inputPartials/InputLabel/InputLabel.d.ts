import React from "react";
export interface InputLabelProps {
    inputId: string;
    label: string;
    required: boolean;
    contextIsVisible?: boolean;
    contextToggleHandler?: (contextIsActive: boolean) => void;
    hideOptional?: boolean;
}
export declare const InputLabel: React.FC<InputLabelProps>;
export default InputLabel;
