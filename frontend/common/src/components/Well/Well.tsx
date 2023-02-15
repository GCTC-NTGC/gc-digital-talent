import React from "react";

export interface WellProps extends React.HTMLProps<HTMLDivElement> {
  children: React.ReactNode;
}

const Well = ({ children, ...rest }: WellProps) => (
  <div
    data-h2-background-color="base(background.dark)"
    data-h2-border="base(1px solid background.darker)"
    data-h2-padding="base(x1)"
    data-h2-radius="base(s)"
    {...rest}
  >
    {children}
  </div>
);

export default Well;
