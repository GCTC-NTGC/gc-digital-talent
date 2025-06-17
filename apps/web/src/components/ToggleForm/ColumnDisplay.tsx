import { ReactNode } from "react";

interface ColumnDisplayProps {
  children: ReactNode;
}

const ColumnDisplay = ({ children }: ColumnDisplayProps) => (
  <div className="flex flex-col gap-y-6">{children}</div>
);

export default ColumnDisplay;
