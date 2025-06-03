import { forwardRef } from "react";
import ArrowTopRightOnSquareIcon from "@heroicons/react/20/solid/ArrowTopRightOnSquareIcon";
import { useIntl } from "react-intl";

import { uiMessages } from "@gc-digital-talent/i18n";

import { btn, BaseButtonLinkProps } from "../../utils/btnStyles";
import BaseLink, { BaseLinkProps } from "./BaseLink";

export interface LinkProps
  extends BaseButtonLinkProps,
    Omit<BaseLinkProps, "color"> {
  disabled?: boolean;
}

const Link = forwardRef<HTMLAnchorElement, Omit<LinkProps, "ref">>(
  (
    {
      href,
      color = "primary",
      mode = "text",
      block = false,
      size = "md",
      external = false,
      newTab = false,
      disabled = false,
      icon,
      utilityIcon,
      children,
      className,
      ...rest
    },
    forwardedRef,
  ) => {
    const intl = useIntl();
    const Icon = icon;
    const UtilityIcon = utilityIcon;
    const { base, leadingIcon, trailingIcon, label, alignment } = btn({
      color,
      block,
      mode,
      size,
      disabled,
    });
    return (
      <BaseLink
        ref={forwardedRef}
        href={href}
        newTab={newTab}
        external={external}
        className={base({ class: className })}
        {...rest}
      >
        <span className={alignment()}>
          {Icon && <Icon className={leadingIcon()} />}
          <span className={label()}>{children}</span>
          {UtilityIcon && <UtilityIcon className={trailingIcon()} />}
          {newTab && (
            <ArrowTopRightOnSquareIcon
              className={trailingIcon()}
              aria-label={intl.formatMessage(uiMessages.newTab)}
            />
          )}
        </span>
      </BaseLink>
    );
  },
);

export default Link;
