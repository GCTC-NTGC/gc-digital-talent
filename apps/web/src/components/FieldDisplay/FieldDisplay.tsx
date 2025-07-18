import { HTMLAttributes, ReactNode } from "react";
import { tv } from "tailwind-variants";
import { useIntl } from "react-intl";

import { appendLanguageName, Locales } from "@gc-digital-talent/i18n";

const fieldDisplay = tv({
  base: "",
  variants: {
    hasError: {
      true: "text-error-600 dark:text-error-100",
    },
  },
});

interface FieldDisplayProps extends HTMLAttributes<HTMLDivElement> {
  label: ReactNode;
  children?: ReactNode;
  hasError?: boolean | null;
  appendLanguageToLabel?: Locales;
}

const FieldDisplay = ({
  label,
  children,
  hasError,
  className,
  appendLanguageToLabel,
  ...rest
}: FieldDisplayProps) => {
  const intl = useIntl();
  return (
    <div
      className={fieldDisplay({
        hasError: hasError ?? false,
        class: className,
      })}
      {...rest}
    >
      {appendLanguageToLabel ? (
        <span className="block font-bold">
          {appendLanguageName({
            label: label,
            lang: appendLanguageToLabel,
            intl,
            formatted: true,
          })}
        </span>
      ) : (
        <span className="block font-bold">{label}</span>
      )}
      {children && <span>{children}</span>}
    </div>
  );
};

export default FieldDisplay;
