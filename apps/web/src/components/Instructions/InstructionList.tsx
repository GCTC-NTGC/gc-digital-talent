import { ReactNode } from "react";

interface InstructionListProps {
  children: ReactNode;
}

const InstructionList = ({ children }: InstructionListProps) => {
  return (
    <ol
      data-h2-display="base(grid)"
      data-h2-grid-template-columns="base(repeat(1, minmax(0, 1fr))) l-tablet(repeat(4, minmax(0, 1fr)))"
      data-h2-gap="base(x1.5)"
      data-h2-padding="base(0)"
    >
      {children}
    </ol>
  );
};

export default InstructionList;
