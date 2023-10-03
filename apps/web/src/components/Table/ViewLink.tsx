import React from "react";
import { useIntl } from "react-intl";

import { Link, LinkProps } from "@gc-digital-talent/ui";

interface ViewLinkProps extends LinkProps {
  /** The destination url. */
  href: string;
  /** Name of the type of object */
  name: string;
  /** Label for link text  */
  hiddenLabel?: string;
}

function ViewLink({
  href,
  name,
  hiddenLabel,
  ...rest
}: ViewLinkProps): React.ReactElement {
  const intl = useIntl();
  return (
    <Link href={href} {...rest}>
      {intl.formatMessage(
        {
          defaultMessage: "View {name} <hidden>{hiddenLabel}</hidden>",
          id: "+wG2Ap",
          description: "Title displayed for the View Item column.",
        },
        { name, hiddenLabel },
      )}
    </Link>
  );
}

export default ViewLink;
