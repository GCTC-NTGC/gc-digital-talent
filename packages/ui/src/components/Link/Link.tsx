import React from "react";
import {
  Link as RouterLink,
  LinkProps as RouterLinkProps,
} from "react-router-dom";

import { sanitizeUrl } from "@gc-digital-talent/helpers";

import ButtonLinkContent from "../ButtonLinkContent/ButtonLinkContent";
import { ButtonLinkProps } from "../../types";
import getBaseStyle from "../../hooks/Button/getButtonBaseStyle";
import getBackgroundColor from "../../hooks/Button/getButtonBackgroundColor";
import getBorderColor from "../../hooks/Button/getButtonBorderColor";
import getDisplay from "../../hooks/Button/getButtonDisplay";
import getFontColor from "../../hooks/Button/getButtonFontColor";
import getFontWeight from "../../hooks/Button/getButtonFontWeight";
import getShadow from "../../hooks/Button/getButtonShadow";

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
      ...getBaseStyle({ mode }),
      ...getBackgroundColor({ mode, color, disabled }),
      ...getBorderColor({ mode, color, disabled }),
      ...getDisplay({ mode, block }),
      ...getFontColor({ mode, color, disabled }),
      ...getFontWeight({ mode }),
      ...getShadow({ mode, disabled }),
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
