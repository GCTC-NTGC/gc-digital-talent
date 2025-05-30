import {
  Link as RouterLink,
  LinkProps as RouterLinkProps,
  To,
} from "react-router";
import { DetailedHTMLProps, AnchorHTMLAttributes, forwardRef } from "react";

import { sanitizeUrl } from "@gc-digital-talent/helpers";

import ButtonLinkContent from "../ButtonLinkContent/ButtonLinkContent";
import { ButtonLinkProps } from "../../types";
import getButtonStyles from "../../utils/button/getButtonStyles";

export type LinkProps = ButtonLinkProps &
  Omit<RouterLinkProps, "to"> &
  Omit<
    DetailedHTMLProps<
      AnchorHTMLAttributes<HTMLAnchorElement>,
      HTMLAnchorElement
    >,
    "ref" | "href"
  > & {
    external?: boolean;
    newTab?: boolean;
    noUnderline?: boolean;
    disabled?: boolean;
    href?: To;
  };

const Link = forwardRef<HTMLAnchorElement, Omit<LinkProps, "ref">>(
  (
    {
      href,
      color = "secondary",
      mode = "text",
      block = false,
      fontSize = "body",
      external = false,
      newTab = false,
      disabled = false,
      noUnderline = false,
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

    // NOTE: Only expect strings so far
    // eslint-disable-next-line @typescript-eslint/no-base-to-string
    const url = href ? sanitizeUrl(String(href)) : undefined;

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
        noUnderline={noUnderline}
        fontSize={fontSize}
      >
        {children}
      </ButtonLinkContent>
    );

    if (external) {
      return (
        // NOTE: We do want to allow external links to be rendered as <a> tags
        // eslint-disable-next-line react/forbid-elements
        <a ref={ref} href={url ?? "#"} {...commonProps}>
          {content}
        </a>
      );
    }

    return (
      <RouterLink ref={ref} to={url ?? "#"} {...commonProps}>
        {content}
      </RouterLink>
    );
  },
);

export default Link;
