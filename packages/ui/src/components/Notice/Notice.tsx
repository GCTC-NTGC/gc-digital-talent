import {
  ComponentPropsWithoutRef,
  createContext,
  ReactNode,
  use,
  useCallback,
} from "react";
import { tv, VariantProps } from "tailwind-variants";
import { twMerge } from "tailwind-merge";

import useControllableState from "../../hooks/useControllableState";
import { HeadingRank, IconType } from "../../types";
import Separator from "../Separator";

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
      class: "text-gray-600 dark:text-gray-200",
    },
    {
      mode: "inline",
      color: "primary",
      class: "text-primary-600 dark:text-primary-200",
    },
    {
      mode: "inline",
      color: "secondary",
      class: "text-secondary-600 dark:text-secondary-200",
    },
    {
      mode: "inline",
      color: "success",
      class: "text-success-600 dark:text-success-200",
    },
    {
      mode: "inline",
      color: "warning",
      class: "text-warning-600 dark:text-warning-200",
    },
    {
      mode: "inline",
      color: "error",
      class: "text-error-600 dark:text-error-200",
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
});

interface NoticeProps extends RootVariants, Omit<DivProps, "color"> {
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

  const handleDismiss = useCallback(() => {
    setOpen(false);
    onDismiss?.();
  }, [setOpen, onDismiss]);

  return (
    <NoticeContext.Provider value={{ mode, color, onDismiss: handleDismiss }}>
      {open && (
        <div {...rest} className={root({ mode, color, class: className })}>
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
      class: "text-secondary-700 dark:text-secondary-200",
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

const content = tv({
  base: "col-start-2",
  variants: {
    color: {
      gray: "text-gray-700 dark:text-gray-100",
      primary: "text-primary-700 dark:text-primary-100",
      secondary: "text-secondary-700 dark:text-secondary-100",
      success: "text-success-700 dark:text-success-100",
      warning: "text-warning-700 dark:text-warning-100",
      error: "text-error-700 dark:text-error-100",
    },
  },
});

const Content = ({ children, className, ...rest }: DivProps) => {
  const { color } = use(NoticeContext);

  return (
    <div {...rest} className={content({ color, class: className })}>
      {children}
    </div>
  );
};

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
