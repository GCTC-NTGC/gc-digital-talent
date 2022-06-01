import React from "react";

const Content: React.FC = ({ children }) => (
  <div data-h2-flex-item="b(1of1) s(3of4)">
    <div data-h2-padding="b(left, l)">{children}</div>
  </div>
);

export default Content;
