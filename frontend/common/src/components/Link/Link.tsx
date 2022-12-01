import React from "react";
import {
  Link as RouterLink,
  LinkProps as RouterLinkProps,
} from "react-router-dom";
import sanitizeUrl from "../../helpers/sanitizeUrl";
import type { Color } from "../Button";
import useCommonLinkStyles from "./useCommonLinkStyles";

export interface LinkProps
  extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href">,
    Omit<RouterLinkProps, "to"> {
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
  weight,
  disabled,
  mode = "solid",
  block = false,
  type = "link",
  children,
  ...rest
}: LinkProps): React.ReactElement => {
  const url = sanitizeUrl(href);
  const styles = useCommonLinkStyles({
    color,
    mode,
    block,
    disabled,
    type,
    weight,
  });
  return (
    <RouterLink to={url || "#"} {...styles} {...rest}>
      {children}
    </RouterLink>
  );
};

export default Link;
