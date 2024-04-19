import React from "react";

interface ColumnDisplayProps {
  children: React.ReactNode;
}

const ColumnDisplay = ({ children }: ColumnDisplayProps) => (
  <div
    className="flex"
    data-h2-flex-direction="base(column)"
    data-h2-gap="base(x1, 0)"
  >
    {children}
  </div>
);

export default ColumnDisplay;
