import React from "react";

type LabelProps = React.DetailedHTMLProps<
  React.LabelHTMLAttributes<HTMLLabelElement>,
  HTMLLabelElement
> & {
  required?: boolean;
};

const Label = ({ required, children, ...props }: LabelProps) => (
  <label {...props}>
    {children}
    {required && <span data-h2-color="base(error)"> *</span>}
  </label>
);

export default Label;
