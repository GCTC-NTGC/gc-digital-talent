import React from "react";

interface DisplayColumnProps {
  children: React.ReactNode;
}

const DisplayColumn = ({ children }: DisplayColumnProps) => (
  <div className="flex flex-col gap-y-6">{children}</div>
);

export default DisplayColumn;
