import React from "react";
export interface ButtonProps extends React.HTMLProps<HTMLButtonElement> {
    /** The style type of the element. */
    color: "primary" | "secondary" | "cta" | "white";
    /** The style mode of the element. */
    mode: "solid" | "outline" | "inline";
    /** Determines whether the element should be block level and 100% width. */
    block?: boolean;
    type?: "button" | "submit" | "reset" | undefined;
}
export declare const Button: React.FC<ButtonProps>;
export default Button;
