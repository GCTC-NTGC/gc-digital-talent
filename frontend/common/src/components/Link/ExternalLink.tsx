import React from "react";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";
import { useIntl } from "react-intl";
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

const ExternalLink: React.FC<ExternalLinkProps> = ({
  newTab,
  children,
  color,
  mode,
  block,
  disabled,
  type,
  weight,
  ...rest
}) => {
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
            {intl.formatMessage({
              defaultMessage: "(opens in new tab)",
              id: "OBQ8b9",
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
