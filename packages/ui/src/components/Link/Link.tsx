import React from "react";
import {
  Link as RouterLink,
  LinkProps as RouterLinkProps,
} from "react-router-dom";

import { sanitizeUrl } from "@gc-digital-talent/helpers";

import useCommonButtonLinkStyles from "../../hooks/useCommonButtonLinkStyles";
import { Color } from "../../types";

type DataAttributes = {
  [key: `data-${string}`]: unknown;
};

export interface LinkProps
  extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href">,
    Omit<RouterLinkProps, "to">,
    DataAttributes {
  /** The style colour of the link */
  href?: string;
  color?: Color;
  disabled?: boolean;
  /** The style mode of the element. */
  mode?: "solid" | "outline" | "inline";
  block?: boolean;
  type?: "button" | "link";
  weight?: "bold";
}

const Link = ({
  href,
  color,
  mode = "solid",
  block = false,
  children,
  ...rest
}: LinkProps): React.ReactElement => {
  const url = sanitizeUrl(href);
  const styles = useCommonButtonLinkStyles({
    mode,
    color: color || "primary",
    block,
  });

  return (
    <RouterLink to={url || "#"} {...styles} {...rest}>
      {children}
    </RouterLink>
  );
};

export default Link;
