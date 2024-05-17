import { useIntl } from "react-intl";
import { ReactNode } from "react";

import { commonMessages } from "@gc-digital-talent/i18n";
import { cn } from "@gc-digital-talent/ui";

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
  context,
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
        className={cn({
          block: context !== "print",
          "font-bold": context === "default",
        })}
      >
        {label}
        {context === "print" &&
          intl.formatMessage(commonMessages.dividingColon)}
      </span>
      {children && (
        <span className={cn({ "font-bold": context === "admin" })}>
          {children}
        </span>
      )}
    </div>
  );
};

export default FieldDisplay;
