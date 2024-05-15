import { DetailedHTMLProps, HTMLAttributes } from "react";

import Required from "./Required";

export type LegendProps = DetailedHTMLProps<
  HTMLAttributes<HTMLLegendElement>,
  HTMLLegendElement
> & {
  required?: boolean;
};

const Legend = ({ required, children, ...props }: LegendProps) => (
  <legend
    data-h2-color="base(black)"
    data-h2-font-size="base(caption)"
    {...props}
  >
    {children}
    <Required required={required} />
  </legend>
);

export default Legend;
