import React from "react";

interface ChipsProps {
  children: React.ReactNode;
}

const Chips = ({ children }: ChipsProps) => (
  <div
    role="list"
    data-h2-display="base(flex)"
    data-h2-flex-wrap="base(wrap)"
    data-h2-gap="base(x.25, x.125)"
  >
    {children}
  </div>
);

export default Chips;
