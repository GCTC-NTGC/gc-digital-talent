import React from "react";

import Required from "./Required";

export type LegendProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLLegendElement>,
  HTMLLegendElement
> & {
  required?: boolean;
};

const Legend = ({ required, children, ...props }: LegendProps) => (
  <legend
    data-h2-position="base(absolute)"
    data-h2-left="base(0)"
    data-h2-top="base(-x1.25)"
    data-h2-font-size="base(copy)"
    data-h2-font-weight="base(700)"
    {...props}
  >
    {children}
    <Required required={required} />
  </legend>
);

export default Legend;
