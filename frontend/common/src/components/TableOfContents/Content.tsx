import React from "react";

const Content: React.FC = ({ children }) => (
  <div data-h2-flex-item="base(1of1) p-tablet(3of4)">
    <div data-h2-padding="base(0, 0, 0, x2)">{children}</div>
  </div>
);

export default Content;
