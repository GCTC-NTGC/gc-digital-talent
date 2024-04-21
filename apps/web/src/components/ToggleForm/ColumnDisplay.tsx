import React from "react";

interface ColumnDisplayProps {
  children: React.ReactNode;
}

const ColumnDisplay = ({ children }: ColumnDisplayProps) => (
  <div className="flex flex-col gap-y-6">{children}</div>
);

export default ColumnDisplay;
