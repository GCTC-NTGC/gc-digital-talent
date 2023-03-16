import React from "react";

type SpacerProps = React.HTMLProps<HTMLSpanElement>;

const Spacer = ({ children, ...rest }: SpacerProps) => (
  <span data-h2-margin="base(0, x.5, x.5, 0)" {...rest}>
    {children}
  </span>
);

export default Spacer;
