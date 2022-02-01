import React from "react";
export interface AccordionProps {
    title: string;
    subtitle?: string;
    Icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    context?: string;
    simple?: boolean;
    defaultOpen?: boolean;
    children?: React.ReactNode;
}
export declare const Accordion: React.FC<AccordionProps>;
export default Accordion;
