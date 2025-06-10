import { forwardRef } from "react";

import { BaseIconButtonLinkProps, iconBtn } from "../../utils/btnStyles";
import BaseLink, { BaseLinkProps } from "./BaseLink";

export interface IconLinkProps
  extends BaseIconButtonLinkProps,
    Omit<BaseLinkProps, "color" | "aria-label"> {}

const IconLink = forwardRef<HTMLAnchorElement, IconLinkProps>(
  (
    {
      color = "primary",
      size = "md",
      icon,
      label,
      className,
      children,
      ...rest
    },
    forwardedRef,
  ) => {
    const Icon = icon;
    const { base, icon: iconStyles } = iconBtn({ color, size });
    return (
      <BaseLink
        ref={forwardedRef}
        aria-label={label}
        className={base({ class: className })}
        {...rest}
      >
        {children && <span className="sr-only">{children}</span>}
        <Icon className={iconStyles()} />
      </BaseLink>
    );
  },
);

export default IconLink;
