import { ReactNode } from "react";
import { tv } from "tailwind-variants";

const instructionList = tv({
  base: "grid gap-9 p-0 xs:grid-cols-2 xs:pr-3 sm:grid-cols-4 sm:p-0",
});

interface InstructionListProps {
  children: ReactNode;
  className?: string;
}

const InstructionList = ({ children, className }: InstructionListProps) => {
  return <ol className={instructionList({ class: className })}>{children}</ol>;
};

export default InstructionList;
