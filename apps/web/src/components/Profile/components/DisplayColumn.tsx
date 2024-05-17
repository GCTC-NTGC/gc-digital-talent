import { ReactNode } from "react";

interface DisplayColumnProps {
  children: ReactNode;
}

const DisplayColumn = ({ children }: DisplayColumnProps) => (
  <div className="flex flex-col gap-y-6">{children}</div>
);

export default DisplayColumn;
