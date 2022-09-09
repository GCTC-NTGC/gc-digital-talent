import React from "react";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";
import { useIntl } from "react-intl";

export interface ExternalLinkProps
  extends React.LinkHTMLAttributes<HTMLAnchorElement> {
  newTab?: boolean;
}

const ExternalLink: React.FC<ExternalLinkProps> = ({
  newTab,
  children,
  ...rest
}) => {
  const intl = useIntl();

  return (
    <a
      {...(newTab && {
        target: "_blank",
        rel: "noopener noreferrer",
        "data-h2-display": "base(inline-flex)",
        "data-h2-align-items": "base(center)",
      })}
      {...rest}
    >
      {newTab ? (
        <>
          <span>{children}</span>
          <ArrowTopRightOnSquareIcon
            data-h2-width="base(x1)"
            data-h2-margin="base(0, 0, 0, x.25)"
          />
          <span data-h2-visibility="base(invisible)">
            {" "}
            {intl.formatMessage({
              defaultMessage: "(opens in new tab)",
              description: "Text that appears in links that open in a new tab.",
            })}
          </span>
        </>
      ) : (
        children
      )}
    </a>
  );
};

export default ExternalLink;
