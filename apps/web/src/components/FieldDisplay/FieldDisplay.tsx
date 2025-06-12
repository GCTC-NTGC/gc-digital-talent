import { HTMLAttributes, ReactNode } from "react";
import { tv } from "tailwind-variants";

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
}

const FieldDisplay = ({
  label,
  children,
  hasError,
  className,
  ...rest
}: FieldDisplayProps) => (
  <div
    className={fieldDisplay({ hasError: hasError ?? false, class: className })}
    {...rest}
  >
    <span className="block font-bold">{label}</span>
    {children && <span>{children}</span>}
  </div>
);

export default FieldDisplay;
