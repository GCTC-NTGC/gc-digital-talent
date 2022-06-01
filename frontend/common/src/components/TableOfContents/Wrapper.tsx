import React from "react";

const Wrapper: React.FC = ({ children }) => (
  <div
    data-h2-position="b(relative)"
    data-h2-flex-grid="b(top, contained, flush, none)"
    data-h2-container="b(center, l)"
    data-h2-padding="b(right-left, s)"
    data-h2-margin="b(bottom, l)"
  >
    {children}
  </div>
);

export default Wrapper;
