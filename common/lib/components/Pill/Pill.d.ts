import React from "react";
export interface PillProps extends React.HTMLProps<HTMLSpanElement> {
    /** The style type of the element. */
    color: "primary" | "secondary";
    /** The style mode of the element. */
    mode: "solid" | "outline";
    /** Determines whether the element should be block level and 100% width. */
    block?: boolean;
}
export declare const Pill: React.FC<PillProps>;
export default Pill;
