import * as React from "react";
import { useIntl } from "react-intl";
import ArrowLeftCircleIcon from "@heroicons/react/24/outline/ArrowLeftCircleIcon";

import { Link } from "@gc-digital-talent/ui";

import useRoutes from "~/hooks/useRoutes";

export interface CancelButtonProps {
  href?: string;
  children?: React.ReactNode;
}

const CancelButton = ({ href, children }: CancelButtonProps) => {
  const intl = useIntl();
  const paths = useRoutes();
  return (
    <Link
      href={href || paths.myProfile()}
      color="secondary"
      mode="inline"
      icon={ArrowLeftCircleIcon}
    >
      {children ||
        intl.formatMessage({
          defaultMessage: "Cancel and go back",
          id: "fMcKtJ",
          description: "Text to cancel changes to a form",
        })}
    </Link>
  );
};

export default CancelButton;
