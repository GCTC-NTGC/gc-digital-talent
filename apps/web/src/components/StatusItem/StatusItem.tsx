import * as React from "react";
import CheckCircleIcon from "@heroicons/react/20/solid/CheckCircleIcon";
import ExclamationCircleIcon from "@heroicons/react/20/solid/ExclamationCircleIcon";

import { Link, IconType, ScrollToLink, Color } from "@gc-digital-talent/ui";

export type Status = "error" | "success";
type StatusColor = "black" | Status;

const iconColorMap: Record<StatusColor, Record<string, string>> = {
  black: {
    "data-h2-color": "base(black.light) base:hover(primary)",
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
  color,
  ...rest
}: {
  href?: string;
  scrollTo?: string;
  children?: React.ReactElement;
  color?: Color;
}) => {
  if (href) {
    return (
      <Link href={href} mode="text" color={color} {...rest}>
        {children}
      </Link>
    );
  }
  if (scrollTo) {
    return (
      <ScrollToLink to={scrollTo} color={color} {...rest}>
        {children}
      </ScrollToLink>
    );
  }
  return <span {...rest}>{children}</span>;
};

interface StatusItemProps {
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

const StatusItem = ({
  title,
  titleColor = "black",
  status,
  icon,
  iconColor = "black",
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
          data-h2-text-align="base(left)"
          color={effectiveTitleColor}
        >
          {combinedTitle}
        </StatusItemTitle>
      </span>

      {itemCount && <span>{itemCount}</span>}
    </Wrapper>
  );
};

export default StatusItem;
