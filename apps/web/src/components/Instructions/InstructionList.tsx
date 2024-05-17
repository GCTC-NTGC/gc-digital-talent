import { ReactNode } from "react";

export interface InstructionListProps {
  children: ReactNode;
}

export const InstructionList = ({ children }: InstructionListProps) => {
  return <ol className="grid gap-10 p-0 md:grid-cols-4">{children}</ol>;
};
