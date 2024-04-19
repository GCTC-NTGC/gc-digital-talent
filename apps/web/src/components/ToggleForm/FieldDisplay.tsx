import React from "react";

interface FieldDisplayProps {
  label: React.ReactNode;
  children?: React.ReactNode;
  hasError?: boolean | null;
}

const FieldDisplay = ({
  label,
  children,
  hasError,
  ...rest
}: FieldDisplayProps) => (
  <div
    {...(hasError && {
      "data-h2-color": "base(error.darker) base:dark(error.lightest)",
    })}
    {...rest}
  >
    <span className="block font-bold">{label}</span>
    {children && <span>{children}</span>}
  </div>
);

export default FieldDisplay;
