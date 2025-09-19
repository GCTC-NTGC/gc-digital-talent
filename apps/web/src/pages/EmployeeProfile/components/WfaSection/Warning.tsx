import { ReactNode } from "react";
import ExclamationTriangleIcon from "@heroicons/react/20/solid/ExclamationTriangleIcon";
import { tv } from "tailwind-variants";

import { Well } from "@gc-digital-talent/ui";

const warning = tv({ base: "mb-6 flex items-start gap-x-1.5" });

interface WarningProps {
  children: ReactNode;
  className?: string;
  isError?: boolean;
}

const Warning = ({ children, className, isError }: WarningProps) => (
  <Well
    color={isError ? "error" : "warning"}
    className={warning({ class: className })}
  >
    <ExclamationTriangleIcon className="mt-1 size-4 shrink-0" />
    <div className="flex-grow">{children}</div>
  </Well>
);

export default Warning;
