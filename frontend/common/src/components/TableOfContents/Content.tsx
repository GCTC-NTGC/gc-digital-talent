import React from "react";

const Content: React.FC = ({ children }) => (
  <div data-h2-flex-item="base(1of1) l-tablet(3of4)">
    <div data-h2-padding="p-tablet(left, l)">{children}</div>
  </div>
);

export default Content;
