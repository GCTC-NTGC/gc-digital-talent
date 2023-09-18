import React from "react";

export interface InstructionListProps {
  children: React.ReactNode;
}

export const InstructionList = ({ children }: InstructionListProps) => {
  return (
    <ol
      data-h2-flex-grid="base(flex-start, x2, x2)"
      data-h2-list-style="base(none)"
    >
      {children}
    </ol>
  );
};
