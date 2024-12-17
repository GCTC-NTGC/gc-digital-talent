import { useIntl } from "react-intl";
import { useLocation } from "react-router";
import { ReactElement } from "react";

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
}: ViewLinkProps): ReactElement {
  const intl = useIntl();
  const { pathname, search, hash } = useLocation();
  const currentUrl = `${pathname}${search}${hash}`; // Passing the current url, including search params, allows the next page to return to current table state.
  return (
    <Link href={href} {...rest} state={{ from: currentUrl }}>
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
