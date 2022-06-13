import React from "react";

const Content: React.FC = ({ children }) => (
  <div data-h2-flex-item="b(1of1) s(3of4)">
    <div data-h2-padding="b(0, 0, 0, x2)">{children}</div>
  </div>
);

export default Content;
