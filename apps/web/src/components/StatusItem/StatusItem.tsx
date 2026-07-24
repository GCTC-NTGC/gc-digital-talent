import CheckCircleIcon from "@heroicons/react/20/solid/CheckCircleIcon";
import ExclamationCircleIcon from "@heroicons/react/20/solid/ExclamationCircleIcon";
import ExclamationTriangleIcon from "@heroicons/react/20/solid/ExclamationTriangleIcon";
import QuestionMarkCircleIcon from "@heroicons/react/20/solid/QuestionMarkCircleIcon";
import type { VariantProps } from "tailwind-variants";
import { tv } from "tailwind-variants";
import XCircleIcon from "@heroicons/react/20/solid/XCircleIcon";
import LockClosedIcon from "@heroicons/react/20/solid/LockClosedIcon";
import type { ComponentProps } from "react";

import type { IconType } from "@gc-digital-talent/ui";
import { Link, ScrollToLink } from "@gc-digital-talent/ui";

export type Status =
  "error" | "success" | "warning" | "optional" | "not done" | "locked";
type Layout = "compact" | "hero";

const statusItem = tv({
  slots: {
    base: "flex justify-between gap-1",
    icon: "ease mt-1 size-4.5 shrink-0 transition-colors duration-200",
  },
  variants: {
    layout: {
      hero: {
        base: "border-gray-200 not-first:border-t dark:border-gray-600",
      },
      compact: {},
    },
    color: {
      black: {
        icon: "text-gray-600 dark:text-gray-200",
      },
      error: {
        icon: "text-error-500 dark:text-error-300",
      },
      success: {
        icon: "text-success-500 dark:text-success-300",
      },
      warning: {
        icon: "text-warning-500 dark:text-warning-300",
      },
      primary: {
        icon: "text-primary-500 dark:text-primary-300",
      },
    },
  },
});

type StatusVariants = Pick<VariantProps<typeof statusItem>, "color">;

// could be a regular link, a scroll link, or just a regular span
const StatusItemTitle = ({
  href,
  scrollTo,
  onScrollTo,
  children,
  color,
  ...rest
}: {
  href?: string;
  scrollTo?: string;
  onScrollTo?: ComponentProps<typeof ScrollToLink>["onScrollTo"];
  className?: string;
  children?: React.ReactElement;
  color?: StatusVariants["color"];
}) => {
  if (href) {
    return (
      <Link href={href} mode="text" color={color} {...rest}>
        {children}
      </Link>
    );
  }
  if (scrollTo) {
    const defaultHandleScrollTo: ComponentProps<
      typeof ScrollToLink
    >["onScrollTo"] = (_, section) => {
      if (section) {
        section.focus();
      }
    };

    return (
      <ScrollToLink
        to={scrollTo}
        color={color}
        onScrollTo={onScrollTo ?? defaultHandleScrollTo}
        {...rest}
      >
        {children}
      </ScrollToLink>
    );
  }
  return <span {...rest}>{children}</span>;
};

interface StatusItemProps {
  title: string;
  titleColor?: StatusVariants["color"];
  status?: Status;
  icon?: IconType;
  iconColor?: StatusVariants["color"];
  href?: string;
  scrollTo?: string;
  onScrollTo?: ComponentProps<typeof ScrollToLink>["onScrollTo"];
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
  onScrollTo,
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
    case "not done":
      Icon = XCircleIcon;
      break;
    case "locked":
      Icon = LockClosedIcon;
      break;
    default:
      Icon = icon;
  }

  const Wrapper = asListItem ? "li" : "span";

  // combine the context prefix for a11y if available
  const combinedTitle = (
    <>
      {hiddenContextPrefix ? (
        <span className="sr-only">
          {/* eslint-disable-next-line formatjs/no-literal-string-in-jsx */}
          {`${hiddenContextPrefix} - `}
        </span>
      ) : null}
      {title}
    </>
  );

  let effectiveIconColor = iconColor;
  switch (status) {
    case "optional":
    case "not done":
    case "locked":
      effectiveIconColor = "black";
      break;
    default:
      effectiveIconColor = status ?? iconColor;
  }
  const effectiveTitleColor = status === "error" ? "error" : titleColor;

  const { base, icon: iconStyles } = statusItem({
    layout,
    color: effectiveIconColor,
  });

  return (
    <Wrapper className={base()}>
      <span className="flex gap-3">
        {Icon && <Icon className={iconStyles()} />}

        <StatusItemTitle
          href={href}
          scrollTo={scrollTo}
          onScrollTo={onScrollTo}
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
