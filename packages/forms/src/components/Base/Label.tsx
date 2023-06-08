import React from "react";

import Required from "./Required";

type LabelProps = React.DetailedHTMLProps<
  React.LabelHTMLAttributes<HTMLLabelElement>,
  HTMLLabelElement
> & {
  required?: boolean;
};

const Label = ({ required, children, ...props }: LabelProps) => (
  <label {...props}>
    {children}
    <Required required={required} />
  </label>
);

export default Label;
