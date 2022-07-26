import React from "react";

const Wrapper: React.FC = ({ children }) => (
  <div data-h2-padding="base(0, 0, x3, 0)">
    <div data-h2-container="base(center, large, x1) p-tablet(center, large, x2)">
      <div data-h2-flex-grid="base(flex-start, 0, x2) p-tablet(stretch, 0, x3)">
        {children}
      </div>
    </div>
  </div>
);

export default Wrapper;
