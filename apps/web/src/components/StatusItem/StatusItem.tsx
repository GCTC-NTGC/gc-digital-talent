import * as React from "react";
import CheckCircleIcon from "@heroicons/react/20/solid/CheckCircleIcon";
import ExclamationCircleIcon from "@heroicons/react/20/solid/ExclamationCircleIcon";
import ExclamationTriangleIcon from "@heroicons/react/20/solid/ExclamationTriangleIcon";
import QuestionMarkCircleIcon from "@heroicons/react/20/solid/QuestionMarkCircleIcon";

import { Link, IconType, ScrollToLink, cn } from "@gc-digital-talent/ui";

export type Status = "error" | "success" | "warning" | "optional";
export type StatusColor =
  | "black"
  | "error"
  | "success"
  | "warning"
  | "secondary";
type Layout = "compact" | "hero";

const iconColorMap: Record<StatusColor, Record<string, string>> = {
  black: {
    "data-h2-color": "base(black.light)",
  },
  error: {
    "data-h2-color": "base(error.dark)",
  },
  success: {
    "data-h2-color": "base(success.dark)",
  },
  warning: {
    "data-h2-color": "base(warning.dark)",
  },
  secondary: {
    "data-h2-color": "base(secondary.dark)",
  },
};

const layoutStyleMap: Record<Layout, Record<string, string>> = {
  hero: {
    "data-h2-border-top":
      "base:selectors[:not(:first-child)](1px solid gray.lighter)",
  },
  compact: {},
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
  color?: StatusColor;
  className?: string;
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
  layout?: Layout;
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
  layout = "compact",
}: StatusItemProps) => {
  let Icon: IconType | null | undefined;
  switch (status) {
    case "error":
      Icon = ExclamationCircleIcon;
      break;
    case "success":
      Icon = CheckCircleIcon;
      break;
    case "warning":
      Icon = ExclamationTriangleIcon;
      break;
    case "optional":
      Icon = QuestionMarkCircleIcon;
      break;
    default:
      Icon = icon;
  }

  const Wrapper = asListItem ? "li" : "span";

  // combine the context prefix for a11y if available
  const combinedTitle = (
    <>
      {hiddenContextPrefix ? (
        <span className="sr-only">{`${hiddenContextPrefix} - `}</span>
      ) : null}
      {title}
    </>
  );

  let effectiveIconColor = iconColor;
  switch (status) {
    case "optional":
      effectiveIconColor = "secondary";
      break;
    default:
      effectiveIconColor = status ?? iconColor;
  }
  const effectiveTitleColor = status === "error" ? "error" : titleColor;

  return (
    <Wrapper
      className={cn("flex justify-between gap-1", {
        "[&:not(:first-child)]:mt-3 [&:not(:first-child)]:pt-3":
          layout === "hero",
      })}
      {...layoutStyleMap[layout]}
    >
      <span className="flex gap-x-3">
        {Icon && (
          <Icon
            className="mt-1 h-4.5 w-4.5 transition-colors duration-200 ease-in-out"
            {...iconColorMap[effectiveIconColor]}
          />
        )}

        <StatusItemTitle
          href={href}
          scrollTo={scrollTo}
          color={effectiveTitleColor}
          className="text-left"
        >
          {combinedTitle}
        </StatusItemTitle>
      </span>

      {itemCount && <span>{itemCount}</span>}
    </Wrapper>
  );
};

export default StatusItem;
