import React from "react";

const Wrapper: React.FC = ({ children }) => (
  <div data-h2-padding="base(0, 0, x3, 0)">
    <div data-h2-container="base(center, full, 0)">
      <div data-h2-flex-grid="base(flex-start, 0, x2, 0) l-tablet(stretch, 0, x3)">
        {children}
      </div>
    </div>
  </div>
);

export default Wrapper;
