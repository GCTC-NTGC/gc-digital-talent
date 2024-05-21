import { DetailedHTMLProps, LabelHTMLAttributes, forwardRef } from "react";

import Required from "./Required";

export type LabelProps = DetailedHTMLProps<
  LabelHTMLAttributes<HTMLLabelElement>,
  HTMLLabelElement
> & {
  required?: boolean;
};

const Label = forwardRef<HTMLLabelElement, LabelProps>(
  ({ required, children, ...props }, forwardedRef) => (
    <label
      ref={forwardedRef}
      data-h2-color="base(black)"
      data-h2-font-size="base(caption)"
      {...props}
    >
      {children}
      <Required required={required} />
    </label>
  ),
);

export default Label;
