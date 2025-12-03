import { ReactNode } from "react";
import ExclamationTriangleIcon from "@heroicons/react/20/solid/ExclamationTriangleIcon";

import { Notice } from "@gc-digital-talent/ui";

interface WarningProps {
  children: ReactNode;
  className?: string;
  isError?: boolean;
}

const Warning = ({ children, className, isError }: WarningProps) => (
  <Notice.Root color={isError ? "error" : "warning"} className={className}>
    <Notice.Title icon={ExclamationTriangleIcon}>{children}</Notice.Title>
  </Notice.Root>
);

export default Warning;
