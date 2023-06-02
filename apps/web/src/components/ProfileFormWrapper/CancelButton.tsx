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
      data-h2-display="p-tablet(inline-flex)"
      data-h2-width="base(auto)"
      data-h2-align-items="base(center)"
      data-h2-padding="base(0)"
    >
      <ArrowLeftCircleIcon style={{ width: "1rem" }} />
      <span data-h2-margin="base(auto, auto, auto, x.125)">
        {children ||
          intl.formatMessage({
            defaultMessage: "Cancel and go back",
            id: "fMcKtJ",
            description: "Text to cancel changes to a form",
          })}
      </span>
    </Link>
  );
};

export default CancelButton;
