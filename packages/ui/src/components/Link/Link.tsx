import React from "react";
import {
  Link as RouterLink,
  LinkProps as RouterLinkProps,
} from "react-router-dom";
import { useIntl } from "react-intl";
import ArrowTopRightOnSquareIcon from "@heroicons/react/24/outline/ArrowTopRightOnSquareIcon";

import { uiMessages } from "@gc-digital-talent/i18n";
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
  > & {
    external?: boolean;
    newTab?: boolean;
    disabled?: boolean;
  };

const Link = React.forwardRef<HTMLAnchorElement, Omit<LinkProps, "ref">>(
  (
    {
      href,
      color = "primary",
      mode = "inline",
      block = false,
      light = false,
      external = false,
      newTab = false,
      disabled = false,
      icon,
      children,
      ...rest
    },
    ref,
  ) => {
    // Note: Can we replace this with conditional props?
    if (!icon && mode === "cta") {
      throw new Error("Icon is required when mode is set to 'cta'");
    }

    const intl = useIntl();
    const url = sanitizeUrl(href);
    const styles = useCommonButtonLinkStyles({
      mode,
      color,
      block,
      light,
      disabled,
    });

    const commonProps = {
      ...(newTab
        ? {
            target: "_blank",
            rel: "noopener noreferrer",
          }
        : {}),
      ...styles,
      ...rest,
    };

    const content = (
      <ButtonLinkContent mode={mode} icon={icon}>
        {children}
        {newTab && (
          <ArrowTopRightOnSquareIcon
            aria-label={intl.formatMessage(uiMessages.newTab)}
            data-h2-width="base(x1)"
            data-h2-margin="base(0, 0, 0, x.25)"
          />
        )}
      </ButtonLinkContent>
    );

    if (external) {
      return (
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
