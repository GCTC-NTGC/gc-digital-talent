import * as React from "react";

import CheckCircleIcon from "@heroicons/react/20/solid/CheckCircleIcon";
import ExclamationCircleIcon from "@heroicons/react/20/solid/ExclamationCircleIcon";

import { Link, IconType, ScrollToLink } from "@gc-digital-talent/ui";

export type Status = "error" | "success";
export type StatusColor = "default" | Status;

const textColorMap: Record<StatusColor, Record<string, string>> = {
  default: {
    "data-h2-color": "base(black) base:hover(primary)",
  },
  error: {
    "data-h2-color": "base(error.darker) base:hover(error.darkest)",
  },
  success: {
    "data-h2-color": "base(success) base:hover(success.darker)",
  },
};

const iconColorMap: Record<StatusColor, Record<string, string>> = {
  default: {
    "data-h2-color": "base(black) base:hover(primary)",
  },
  error: {
    "data-h2-color": "base(error)",
  },
  success: {
    "data-h2-color": "base(success)",
  },
};

// could be a regular link, a scroll link, or just a regular span
const StatusItemTitle = ({
  href,
  scrollTo,
  children,
  ...rest
}: {
  href?: string;
  scrollTo?: string;
  children?: React.ReactElement;
}) => {
  if (href) {
    return (
      <Link href={href} {...rest}>
        {children}
      </Link>
    );
  }
  if (scrollTo) {
    return (
      <ScrollToLink to={scrollTo} {...rest}>
        {children}
      </ScrollToLink>
    );
  }
  return <span {...rest}>{children}</span>;
};

export interface StatusItemProps {
  title: string;
  titleColor?: StatusColor;
  status?: Status;
  icon?: IconType;
  iconColor?: StatusColor;
  href?: string;
  scrollTo?: string;
  hiddenContextPrefix?: string;
  asListItem?: boolean;
  itemCount?: number;
}

export const StatusItem = ({
  title,
  titleColor = "default",
  status,
  icon,
  iconColor = "default",
  href,
  scrollTo,
  hiddenContextPrefix,
  asListItem = true,
  itemCount,
}: StatusItemProps) => {
  let Icon: IconType | null | undefined;
  switch (status) {
    case "error":
      Icon = ExclamationCircleIcon;
      break;
    case "success":
      Icon = CheckCircleIcon;
      break;
    default:
      Icon = icon;
  }

  const Wrapper = asListItem ? "li" : "span";

  // combine the context prefix for a11y if available
  const combinedTitle = (
    <>
      {hiddenContextPrefix ? (
        <span data-h2-visually-hidden="base(invisible)">
          {`${hiddenContextPrefix} - `}
        </span>
      ) : null}
      {title}
    </>
  );

  const effectiveIconColor = status ?? iconColor;
  const effectiveTitleColor = status === "error" ? "error" : titleColor;

  return (
    <Wrapper
      data-h2-display="base(flex)"
      data-h2-flex-direction="base(row)"
      data-h2-border-top="base:selectors[:not(:first-child)](1px solid gray.lighter)"
      data-h2-margin-top="base:selectors[:not(:first-child)](x.5)"
      data-h2-padding-top="base:selectors[:not(:first-child)](x.5)"
      data-h2-justify-content="base(space-between)"
    >
      <span
        data-h2-display="base(flex)"
        data-h2-flex-direction="base(row)"
        data-h2-gap="base(x0.5)"
      >
        {Icon && (
          <Icon
            data-h2-height="base(x.75)"
            data-h2-width="base(x.75)"
            data-h2-min-width="base(x.75)"
            data-h2-margin-top="base(x.15)"
            data-h2-transition="base(color .2s ease)"
            {...iconColorMap[effectiveIconColor]}
          />
        )}

        <StatusItemTitle
          href={href}
          scrollTo={scrollTo}
          {...textColorMap[effectiveTitleColor]}
        >
          {combinedTitle}
        </StatusItemTitle>
      </span>

      {itemCount && <span>{itemCount}</span>}
    </Wrapper>
  );
};

export default StatusItem;
