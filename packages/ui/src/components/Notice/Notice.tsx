import {
  ComponentPropsWithoutRef,
  createContext,
  forwardRef,
  ReactNode,
  use,
  useCallback,
} from "react";
import { tv, VariantProps } from "tailwind-variants";
import { twMerge } from "tailwind-merge";
import XMarkIcon from "@heroicons/react/20/solid/XMarkIcon";
import { useIntl } from "react-intl";
import BellAlertIcon from "@heroicons/react/24/outline/BellAlertIcon";
import CheckCircleIcon from "@heroicons/react/24/outline/CheckCircleIcon";
import ExclamationCircleIcon from "@heroicons/react/24/outline/ExclamationCircleIcon";
import ExclamationTriangleIcon from "@heroicons/react/24/outline/ExclamationTriangleIcon";

import { uiMessages } from "@gc-digital-talent/i18n";

import { HeadingRank, IconType } from "../../types";
import Separator from "../Separator";
import IconButton, { IconButtonProps } from "../Button/IconButton";

type DivProps = ComponentPropsWithoutRef<"div">;

const root = tv({
  base: "group relative grid-cols-2 gap-x-3 rounded-lg p-6 has-[>svg]:grid",
  variants: {
    mode: {
      inline: "border",
      card: "bg-white text-gray-700 shadow-xl dark:bg-gray-600 dark:text-gray-100",
    },
    color: {
      gray: "",
      primary: "",
      secondary: "",
      success: "",
      warning: "",
      error: "",
    },
    small: {
      true: "p-4.5 text-sm has-[.NoticeFooter]:pb-3 has-[>svg]:grid-cols-[calc(var(--spacing)*5.325)_1fr] has-[>svg]:pl-3",
      false:
        "p-6 has-[.NoticeFooter]:pb-4.5 has-[>svg]:grid-cols-[calc(var(--spacing)*6)_1fr] has-[>svg]:pl-4.5",
    },
    dismissible: {
      true: "",
      false: "",
    },
  },
  compoundVariants: [
    {
      small: true,
      dismissible: true,
      class: "p-4.5 pr-12 has-[>svg]:pl-3",
    },
    {
      small: false,
      dismissible: true,
      class: "p-6 pr-16.75 has-[>svg]:pl-4.5",
    },
    {
      mode: "inline",
      color: "gray",
      class:
        "bg-gray-100/20 text-gray-600 dark:bg-gray-700/20 dark:text-gray-200",
    },
    {
      mode: "inline",
      color: "primary",
      class:
        "bg-primary-100/20 text-primary-600 dark:bg-primary-700/20 dark:text-primary-200",
    },
    {
      mode: "inline",
      color: "secondary",
      class:
        "bg-secondary-100/20 text-secondary-600 dark:bg-secondary-700/20 dark:text-secondary-200",
    },
    {
      mode: "inline",
      color: "success",
      class:
        "bg-success-100/20 text-success-600 dark:bg-success-700/20 dark:text-success-200",
    },
    {
      mode: "inline",
      color: "warning",
      class:
        "bg-warning-100/20 text-warning-600 dark:bg-warning-700/20 dark:text-warning-200",
    },
    {
      mode: "inline",
      color: "error",
      class:
        "bg-error-100/20 text-error-600 dark:bg-error-700/20 dark:text-error-200",
    },
  ],
});

type RootVariants = VariantProps<typeof root>;

interface NoticeContextValue extends RootVariants {
  onDismiss?: () => void;
}

const NoticeContext = createContext<NoticeContextValue>({
  mode: "inline",
  color: "gray",
  small: false,
});

export interface NoticeProps extends RootVariants, Omit<DivProps, "color"> {
  onDismiss?: () => void;
}

const Root = forwardRef<HTMLDivElement, NoticeProps>(
  (
    {
      mode = "inline",
      color = "gray",
      small = false,
      children,
      onDismiss,
      className,
      ...rest
    },
    forwardedRef,
  ) => {
    const intl = useIntl();
    let iconColor: IconButtonProps["color"];
    if (mode === "inline") {
      iconColor = color === "gray" ? "black" : color;
    }

    const handleDismiss = useCallback(() => {
      onDismiss?.();
    }, [onDismiss]);

    return (
      <NoticeContext.Provider
        value={{
          mode,
          color,
          small,
          dismissible: !!onDismiss,
          onDismiss: handleDismiss,
        }}
      >
        <div
          ref={forwardedRef}
          {...rest}
          className={root({
            mode,
            color,
            small,
            dismissible: !!onDismiss,
            class: className,
          })}
        >
          {onDismiss && (
            <IconButton
              icon={XMarkIcon}
              className="absolute top-3 right-3"
              size={small ? "sm" : "md"}
              color={iconColor ?? "black"}
              onClick={handleDismiss}
              label={intl.formatMessage(uiMessages.closeAlert)}
            />
          )}
          {children}
        </div>
      </NoticeContext.Provider>
    );
  },
);

const title = tv({
  slots: {
    icon: "h-auto w-full stroke-2",
    heading: "mb-.25 col-start-2 font-bold",
  },
  variants: {
    small: {
      true: {
        heading: "mb-px text-sm/6",
      },
      false: {
        heading: "mb-0.5",
      },
    },
    color: {
      gray: "",
      primary: "",
      secondary: "",
      success: "",
      warning: "",
      error: "",
    },
  },
  compoundSlots: [
    {
      slots: ["icon", "heading"],
      color: "gray",
      class: "text-gray-600 dark:text-gray-100",
    },
    {
      slots: ["icon", "heading"],
      color: "primary",
      class: "text-primary-600 dark:text-primary-100",
    },
    {
      slots: ["icon", "heading"],
      color: "secondary",
      class: "text-secondary-600 dark:text-secondary-100",
    },
    {
      slots: ["icon", "heading"],
      color: "success",
      class: "text-success-600 dark:text-success-100",
    },
    {
      slots: ["icon", "heading"],
      color: "warning",
      class: "text-warning-600 dark:text-warning-100",
    },
    {
      slots: ["icon", "heading"],
      color: "error",
      class: "text-error-600 dark:text-error-100",
    },
  ],
});

const iconMap = new Map<RootVariants["color"], IconType>([
  ["gray", BellAlertIcon],
  ["primary", BellAlertIcon],
  ["secondary", BellAlertIcon],
  ["success", CheckCircleIcon],
  ["warning", ExclamationCircleIcon],
  ["error", ExclamationTriangleIcon],
]);

interface TitleProps {
  icon?: IconType;
  as?: HeadingRank | "p";
  children: ReactNode;
  defaultIcon?: boolean;
}

const Title = ({
  icon: iconEl,
  as: Heading = "p",
  defaultIcon = false,
  children,
}: TitleProps) => {
  const { small, color } = use(NoticeContext);
  const { icon, heading } = title({ small, color });
  let Icon = iconEl;
  if (!iconEl && defaultIcon) {
    Icon = iconMap.get(color);
  }

  return (
    <>
      {Icon && <Icon className={icon()} />}
      <Heading className={heading()}>{children}</Heading>
    </>
  );
};

const Content = ({ children, className, ...rest }: DivProps) => (
  <div {...rest} className={twMerge("col-start-2", className)}>
    {children}
  </div>
);

const actions = tv({
  base: "col-start-2 flex flex-col flex-wrap items-start gap-4.5 sm:flex-row sm:items-center sm:gap-6",
  variants: {
    small: {
      true: "mt-3",
      false: "mt-4.5",
    },
  },
});

const Actions = ({ className, ...rest }: DivProps) => {
  const { small } = use(NoticeContext);
  return <div className={actions({ small, class: className })} {...rest} />;
};

const footer = tv({
  slots: {
    base: "NoticeFooter col-span-2",
    separator: "bg-gray-600 dark:bg-gray-200",
    content: "col-start-2 text-sm",
  },
  variants: {
    mode: {
      inline: "",
      card: "",
    },
    small: {
      true: { base: "-mx-3", separator: "mt-4.5 mb-3" },
      false: { base: "-mx-4.5", separator: "mt-6 mb-4.5" },
    },
    dismissible: {
      true: "",
      false: "",
    },
    color: {
      gray: "",
      primary: "",
      secondary: "",
      success: "",
      warning: "",
      error: "",
    },
  },
  compoundVariants: [
    {
      small: true,
      dismissible: true,
      class: "-mr-12 -ml-4.5 group-has-[>svg]:-ml-3",
    },
    {
      small: false,
      dismissible: true,
      class: "-mr-16.75 -ml-6 group-has-[>svg]:-ml-4.5",
    },
    {
      small: false,
      dismissible: false,
      class: { base: "-mr-6 -ml-4.5" },
    },
    {
      mode: "inline",
      color: "primary",
      class: { separator: "bg-primary-600 dark:bg-primary-200" },
    },
    {
      mode: "inline",
      color: "secondary",
      class: { separator: "bg-secondary-600 dark:bg-secondary-200" },
    },
    {
      mode: "inline",
      color: "success",
      class: { separator: "bg-success-600 dark:bg-success-200" },
    },
    {
      mode: "inline",
      color: "warning",
      class: { separator: "bg-warning-600 dark:bg-warning-200" },
    },
    {
      mode: "inline",
      color: "error",
      class: { separator: "bg-error-600 dark:bg-error-200" },
    },
  ],
});

const Footer = ({ className, ...rest }: DivProps) => {
  const { color, mode, small, dismissible } = use(NoticeContext);
  const { separator, base, content } = footer({
    color,
    mode,
    small,
    dismissible,
  });

  return (
    <>
      <div className={base()}>
        <Separator
          decorative
          orientation="horizontal"
          className={separator()}
        />
      </div>
      <div className={content({ class: className })} {...rest} />
    </>
  );
};

export default {
  Root,
  Title,
  Content,
  Actions,
  Footer,
};
