import { DetailedHTMLProps, HTMLAttributes } from "react";

import Required from "./Required";
import { labelStyles } from "./styles";

export interface LegendProps
  extends DetailedHTMLProps<
    HTMLAttributes<HTMLLegendElement>,
    HTMLLegendElement
  > {
  required?: boolean;
}

const Legend = ({ required, children, className, ...rest }: LegendProps) => (
  <legend className={labelStyles({ class: className })} {...rest}>
    {children}
    <Required required={required} />
  </legend>
);

export default Legend;
