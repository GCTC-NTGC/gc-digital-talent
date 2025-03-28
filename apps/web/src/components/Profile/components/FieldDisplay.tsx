import { useIntl } from "react-intl";
import { ReactNode } from "react";

import { commonMessages } from "@gc-digital-talent/i18n";

interface FieldDisplayProps {
  label: ReactNode;
  children?: ReactNode;
  hasError?: boolean | null;
  context?: "admin" | "default" | "print";
}

const FieldDisplay = ({
  label,
  children,
  hasError,
  context = "default",
  ...rest
}: FieldDisplayProps) => {
  const intl = useIntl();

  return (
    <div
      {...(hasError && {
        "data-h2-color": "base(error.darker) base:dark(error.lightest)",
      })}
      {...rest}
    >
      <span
        {...(context !== "print" && { "data-h2-display": "base(block)" })}
        {...(context === "default" && { "data-h2-font-weight": "base(700)" })}
      >
        {label}
        {context === "print" &&
          intl.formatMessage(commonMessages.dividingColon)}
      </span>
      {children && (
        <span
          {...(context === "admin" && { "data-h2-font-weight": "base(700)" })}
        >
          {children}
        </span>
      )}
    </div>
  );
};

export default FieldDisplay;
