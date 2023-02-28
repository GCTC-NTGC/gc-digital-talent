import React from "react";

const Content: React.FC<{
  children?: React.ReactNode;
}> = ({ children, ...rest }) => (
  <div data-h2-flex-item="base(1of1) l-tablet(3of4)" {...rest}>
    <div>{children}</div>
  </div>
);

export default Content;
