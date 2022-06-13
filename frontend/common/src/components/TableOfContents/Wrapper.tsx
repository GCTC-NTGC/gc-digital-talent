import React from "react";

const Wrapper: React.FC = ({ children }) => (
  <div
    data-h2-position="b(relative)"
    data-h2-flex-grid="b(flex-start, 0, 0)"
    data-h2-container="b(center, l)"
    data-h2-padding="b(0, x.5)"
    data-h2-margin="b(auto, auto, x2, auto)"
  >
    {children}
  </div>
);

export default Wrapper;
