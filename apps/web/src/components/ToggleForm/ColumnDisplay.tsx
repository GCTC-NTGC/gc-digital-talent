import { ReactNode } from "react";

interface ColumnDisplayProps {
  children: ReactNode;
}

const ColumnDisplay = ({ children }: ColumnDisplayProps) => (
  <div
    data-h2-display="base(flex)"
    data-h2-flex-direction="base(column)"
    data-h2-gap="base(x1, 0)"
  >
    {children}
  </div>
);

export default ColumnDisplay;
