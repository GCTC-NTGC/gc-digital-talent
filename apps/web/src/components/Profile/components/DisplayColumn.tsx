import React from "react";

interface DisplayColumnProps {
  children: React.ReactNode;
}

const DisplayColumn = ({ children }: DisplayColumnProps) => (
  <div
    className="flex"
    data-h2-flex-direction="base(column)"
    data-h2-gap="base(x1, 0)"
  >
    {children}
  </div>
);

export default DisplayColumn;
