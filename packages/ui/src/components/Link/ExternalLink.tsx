import React from "react";
import ArrowTopRightOnSquareIcon from "@heroicons/react/24/outline/ArrowTopRightOnSquareIcon";
import { useIntl } from "react-intl";

import { uiMessages } from "@gc-digital-talent/i18n";

import { LinkProps } from "./Link";
import useCommonLinkStyles from "./useCommonLinkStyles";

export interface ExternalLinkProps
  extends LinkProps,
    Omit<
      React.LinkHTMLAttributes<HTMLAnchorElement>,
      "color" | "href" | "type"
    > {
  newTab?: boolean;
}

const ExternalLink = ({
  newTab,
  children,
  color,
  mode = "solid",
  block = false,
  disabled,
  type = "link",
  weight,
  ...rest
}: ExternalLinkProps) => {
  const intl = useIntl();
  const styles = useCommonLinkStyles({
    color,
    mode,
    block,
    disabled,
    type,
    weight,
  });

  return (
    <a
      {...styles}
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
          <span data-h2-visually-hidden="base(invisible)">
            {" "}
            {intl.formatMessage(uiMessages.newTab)}
          </span>
        </>
      ) : (
        children
      )}
    </a>
  );
};

export default ExternalLink;
