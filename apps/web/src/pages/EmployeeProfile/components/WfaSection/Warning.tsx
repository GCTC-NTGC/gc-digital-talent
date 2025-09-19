import { ReactNode } from "react";
import ExclamationTriangleIcon from "@heroicons/react/20/solid/ExclamationTriangleIcon";

import { Well } from "@gc-digital-talent/ui";

interface WarningProps {
  children: ReactNode;
  isError?: boolean;
}

const Warning = ({ children, isError }: WarningProps) => (
  <Well
    color={isError ? "error" : "warning"}
    className="mb-6 flex items-start gap-x-1.5"
  >
    <ExclamationTriangleIcon className="mt-1 size-4 shrink-0" />
    <div className="flex-grow">{children}</div>
  </Well>
);

export default Warning;
