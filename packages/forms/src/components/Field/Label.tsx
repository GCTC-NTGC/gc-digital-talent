import * as React from "react";

import Required from "./Required";

export type LabelProps = React.DetailedHTMLProps<
  React.LabelHTMLAttributes<HTMLLabelElement>,
  HTMLLabelElement
> & {
  required?: boolean;
};

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
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
