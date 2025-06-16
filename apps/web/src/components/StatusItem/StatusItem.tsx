import CheckCircleIcon from "@heroicons/react/20/solid/CheckCircleIcon";
import ExclamationCircleIcon from "@heroicons/react/20/solid/ExclamationCircleIcon";
import ExclamationTriangleIcon from "@heroicons/react/20/solid/ExclamationTriangleIcon";
import QuestionMarkCircleIcon from "@heroicons/react/20/solid/QuestionMarkCircleIcon";
import { tv, VariantProps } from "tailwind-variants";

import { Link, IconType, ScrollToLink } from "@gc-digital-talent/ui";

export type Status = "error" | "success" | "warning" | "optional";
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
  children,
  color,
  ...rest
}: {
  href?: string;
  scrollTo?: string;
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
    return (
      <ScrollToLink
        to={scrollTo}
        color={color}
        onScrollTo={(_, section) => {
          if (section) {
            section.focus();
          }
        }}
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
      effectiveIconColor = "primary";
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
