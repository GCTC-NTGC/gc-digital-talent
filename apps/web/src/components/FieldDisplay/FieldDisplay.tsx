import { HTMLAttributes, ReactNode } from "react";

interface FieldDisplayProps extends HTMLAttributes<HTMLDivElement> {
  label: ReactNode;
  children?: ReactNode;
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
    <span data-h2-display="base(block)" data-h2-font-weight="base(700)">
      {label}
    </span>
    {children && <span>{children}</span>}
  </div>
);

export default FieldDisplay;
