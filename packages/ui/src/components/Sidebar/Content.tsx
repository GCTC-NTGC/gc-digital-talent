import * as React from "react";

const Content = ({ children, ...rest }: { children?: React.ReactNode }) => (
  <div data-h2-flex-item="base(1of1) l-tablet(3of4)" {...rest}>
    <div>{children}</div>
  </div>
);

export default Content;
