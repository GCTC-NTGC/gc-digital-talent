import React from "react";
import {
  Link as RouterLink,
  LinkProps as RouterLinkProps,
} from "react-router-dom";

import { sanitizeUrl } from "@gc-digital-talent/helpers";

import ButtonLinkContent from "../ButtonLinkContent/ButtonLinkContent";
import { ButtonLinkProps } from "../../types";
import getButtonStyles from "../../utils/button/getButtonStyles";

export type LinkProps = ButtonLinkProps &
  Omit<RouterLinkProps, "to"> &
  Omit<
    React.DetailedHTMLProps<
      React.AnchorHTMLAttributes<HTMLAnchorElement>,
      HTMLAnchorElement
    >,
    "ref"
  > & {
    external?: boolean;
    newTab?: boolean;
    disabled?: boolean;
  };

const Link = React.forwardRef<HTMLAnchorElement, Omit<LinkProps, "ref">>(
  (
    {
      href,
      color = "secondary",
      mode = "text",
      block = false,
      external = false,
      newTab = false,
      disabled = false,
      icon,
      utilityIcon,
      children,
      ...rest
    },
    ref,
  ) => {
    // Note: Can we replace this with conditional props?
    if (!icon && mode === "cta") {
      throw new Error("Icon is required when mode is set to 'cta'");
    }

    const url = sanitizeUrl(href);

    const commonProps = {
      ...(newTab
        ? {
            target: "_blank",
            rel: "noopener noreferrer",
          }
        : {}),
      ...getButtonStyles({ mode, color, block, disabled }),
      ...rest,
    };

    const content = (
      <ButtonLinkContent
        mode={mode}
        icon={icon}
        utilityIcon={utilityIcon}
        newTab={newTab}
      >
        {children}
      </ButtonLinkContent>
    );

    if (external) {
      return (
        // NOTE: We do want to allow external links to be rendered as <a> tags
        // eslint-disable-next-line react/forbid-elements
        <a ref={ref} href={url || "#"} {...commonProps}>
          {content}
        </a>
      );
    }

    return (
      <RouterLink ref={ref} to={url || "#"} {...commonProps}>
        {content}
      </RouterLink>
    );
  },
);

export default Link;
