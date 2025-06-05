import { DetailedHTMLProps, LabelHTMLAttributes, forwardRef } from "react";

import Required from "./Required";
import { labelStyles } from "./styles";

export interface LabelProps
  extends DetailedHTMLProps<
    LabelHTMLAttributes<HTMLLabelElement>,
    HTMLLabelElement
  > {
  required?: boolean;
}

const Label = forwardRef<HTMLLabelElement, LabelProps>(
  ({ required, children, className, ...rest }, forwardedRef) => (
    <label
      ref={forwardedRef}
      className={labelStyles({ class: className })}
      {...rest}
    >
      {children}
      <Required required={required} />
    </label>
  ),
);

export default Label;
