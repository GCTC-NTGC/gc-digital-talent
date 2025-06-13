import { ReactNode } from "react";

interface InstructionListProps {
  children: ReactNode;
}

const InstructionList = ({ children }: InstructionListProps) => {
  return <ol className="grid gap-9 p-0 sm:grid-cols-4">{children}</ol>;
};

export default InstructionList;
