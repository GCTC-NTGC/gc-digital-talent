import {
  ComponentPropsWithoutRef,
  createContext,
  ReactNode,
  use,
  useCallback,
} from "react";
import { tv, VariantProps } from "tailwind-variants";
import { twMerge } from "tailwind-merge";
import XMarkIcon from "@heroicons/react/20/solid/XMarkIcon";

import useControllableState from "../../hooks/useControllableState";
import { HeadingRank, IconType } from "../../types";
import Separator from "../Separator";
import IconButton, { IconButtonProps } from "../Button/IconButton";

type DivProps = ComponentPropsWithoutRef<"div">;

const root = tv({
  base: "group relative grid grid-cols-2 gap-x-3 rounded-lg p-6",
  variants: {
    mode: {
      inline: "border has-[>svg]:grid-cols-[calc(var(--spacing)*6)_1fr]",
      card: "bg-white shadow-xl has-[>svg]:grid-cols-[calc(var(--spacing)*7)_1fr] dark:bg-gray-700",
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

export type RootVariants = VariantProps<typeof root>;

interface NoticeContextValue extends RootVariants {
  onDismiss?: () => void;
}

const NoticeContext = createContext<NoticeContextValue>({
  mode: "inline",
  color: "gray",
});

export interface NoticeProps extends RootVariants, Omit<DivProps, "color"> {
  defaultOpen?: boolean;
  open?: boolean;
  onDismiss?: () => void;
  onOpenChange?: (newOpen: boolean) => void;
}

const Root = ({
  mode = "inline",
  color = "gray",
  children,
  onDismiss,
  onOpenChange,
  open: openProp,
  defaultOpen = true,
  className,
  ...rest
}: NoticeProps) => {
  const [open = true, setOpen] = useControllableState<boolean>({
    controlledProp: openProp,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });
  let iconColor: IconButtonProps["color"];
  if (mode === "inline") {
    iconColor = color === "gray" ? "black" : color;
  }

  const handleDismiss = useCallback(() => {
    setOpen(false);
    onDismiss?.();
  }, [setOpen, onDismiss]);

  return (
    <NoticeContext.Provider value={{ mode, color, onDismiss: handleDismiss }}>
      {open && (
        <div {...rest} className={root({ mode, color, class: className })}>
          {onDismiss && (
            <IconButton
              icon={XMarkIcon}
              size="sm"
              className="absolute top-3 right-2"
              color={iconColor ?? "black"}
              onClick={handleDismiss}
            />
          )}
          {children}
        </div>
      )}
    </NoticeContext.Provider>
  );
};

const title = tv({
  slots: {
    icon: "h-auto w-full align-top",
    heading: "mb-.25 col-start-2 font-bold",
  },
  variants: {
    mode: {
      inline: {
        heading: "text-sm/6",
      },
      card: {
        heading: "leading-7",
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
      class: "text-gray-600 dark:text-gray-200",
    },
    {
      slots: ["icon", "heading"],
      color: "primary",
      class: "text-primary-600 dark:text-primary-200",
    },
    {
      slots: ["icon", "heading"],
      color: "secondary",
      class: "text-secondary-600 dark:text-secondary-200",
    },
    {
      slots: ["icon", "heading"],
      color: "success",
      class: "text-success-600 dark:text-success-200",
    },
    {
      slots: ["icon", "heading"],
      color: "warning",
      class: "text-warning-600 dark:text-warning-200",
    },
    {
      slots: ["icon", "heading"],
      color: "error",
      class: "text-error-600 dark:text-error-200",
    },
  ],
});

interface TitleProps {
  icon?: IconType;
  as: HeadingRank;
  children: ReactNode;
}

const Title = ({ icon: Icon, as: Heading, children }: TitleProps) => {
  const { mode, color } = use(NoticeContext);
  const { icon, heading } = title({ mode, color });

  return (
    <>
      {Icon && <Icon className={icon({ mode, color })} />}
      <Heading className={heading()}>{children}</Heading>
    </>
  );
};

const Content = ({ children, className, ...rest }: DivProps) => (
  <div {...rest} className={twMerge("col-start-2", className)}>
    {children}
  </div>
);

const Actions = ({ className, ...rest }: DivProps) => (
  <div
    className={twMerge(
      "col-start-2 mt-4.5 flex flex-col flex-wrap items-center gap-4.5 sm:flex-row",
      className,
    )}
    {...rest}
  />
);

const footer = tv({
  base: "bg-gray-600 dark:bg-gray-200",
  variants: {
    mode: {
      inline: "",
      card: "",
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
      mode: "inline",
      color: "primary",
      class: "bg-primary-600 dark:bg-primary-200",
    },
    {
      mode: "inline",
      color: "secondary",
      class: "bg-secondary-600 dark:bg-secondary-200",
    },
    {
      mode: "inline",
      color: "success",
      class: "bg-success-600 dark:bg-success-200",
    },
    {
      mode: "inline",
      color: "warning",
      class: "bg-warning-600 dark:bg-warning-200",
    },
    {
      mode: "inline",
      color: "error",
      class: "bg-error-600 dark:bg-error-200",
    },
  ],
});

const Footer = ({ className, ...rest }: DivProps) => {
  const { color, mode } = use(NoticeContext);

  return (
    <>
      <div className="col-span-2 -mx-6">
        <Separator
          decorative
          orientation="horizontal"
          space="sm"
          className={footer({ mode, color })}
        />
      </div>
      <div className={twMerge("col-start-2", className)} {...rest} />
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
