import { ReactNode } from "react";

interface InstructionListProps {
  children: ReactNode;
}

const InstructionList = ({ children }: InstructionListProps) => {
  return (
    <ol className="grid gap-9 p-0 xs:grid-cols-2 xs:pr-3 sm:grid-cols-4 sm:p-0">
      {children}
    </ol>
  );
};

export default InstructionList;
