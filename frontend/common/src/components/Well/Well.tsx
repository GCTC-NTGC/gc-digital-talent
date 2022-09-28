import React from "react";

export interface WellProps extends React.HTMLProps<HTMLDivElement> {
  children: React.ReactNode;
}

const Well = ({ children, ...rest }: WellProps) => (
  <div
    data-h2-background-color="base(light.dt-gray)"
    data-h2-padding="base(x1)"
    data-h2-radius="base(s)"
    {...rest}
  >
    {children}
  </div>
);

export default Well;
