import React from "react";
import {
  Link as RouterLink,
  LinkProps as RouterLinkProps,
} from "react-router-dom";

import { sanitizeUrl } from "@gc-digital-talent/helpers";

import ButtonLinkContent from "../ButtonLinkContent/ButtonLinkContent";
import { ButtonLinkProps } from "../../types";
import useCommonButtonLinkStyles from "../../hooks/useCommonButtonLinkStyles";

export type LinkProps = ButtonLinkProps &
  Omit<RouterLinkProps, "to"> &
  Omit<
    React.DetailedHTMLProps<
      React.AnchorHTMLAttributes<HTMLAnchorElement>,
      HTMLAnchorElement
    >,
    "ref"
  >;

const Link = React.forwardRef<HTMLAnchorElement, Omit<LinkProps, "ref">>(
  (
    {
      href,
      color = "primary",
      mode = "inline",
      block = false,
      icon,
      children,
      ...rest
    },
    ref,
  ) => {
    const url = sanitizeUrl(href);
    const styles = useCommonButtonLinkStyles({
      mode,
      color: color || "primary",
      block,
    });

    return (
      <RouterLink ref={ref} to={url || "#"} {...styles} {...rest}>
        <ButtonLinkContent mode={mode} icon={icon}>
          {children}
        </ButtonLinkContent>
      </RouterLink>
    );
  },
);

export default Link;
