import React from "react";

interface FieldDisplayProps {
  label: React.ReactNode;
  children?: React.ReactNode;
  hasError?: boolean | null;
}

const FieldDisplay = ({ label, children, hasError }: FieldDisplayProps) => (
  <p {...(hasError && { "data-h2-color": "base(error)" })}>
    <span data-h2-display="base(block)" data-h2-font-weight="base(700)">
      {label}
    </span>
    {children && <span>{children}</span>}
  </p>
);

export default FieldDisplay;
