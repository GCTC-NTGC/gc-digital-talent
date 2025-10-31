import { createContext, ReactNode, use, useCallback } from "react";
import { tv, VariantProps } from "tailwind-variants";

import useControllableState from "../../hooks/useControllableState";
import { HeadingRank, IconType } from "../../types";

const root = tv({
  base: "group relative grid grid-cols-2 gap-x-3 rounded-lg p-6",
  variants: {
    mode: {
      inline:
        "border has-[.Notice__Icon]:grid-cols-[calc(var(--spacing)*6)_1fr]",
      card: "bg-white shadow-xl has-[.Notice__Icon]:grid-cols-[calc(var(--spacing)*7)_1fr] dark:bg-gray-600",
    },
    color: {
      gray: "text-gray-500",
      primary: "",
      secondary: "",
      success: "",
      warning: "",
      error: "",
    },
  },
});

type RootVariants = VariantProps<typeof root>;

interface NoticeContextValue extends RootVariants {
  onDismiss?: () => void;
}

const NoticeContext = createContext<NoticeContextValue>({
  mode: "inline",
  color: "gray",
});

interface NoticeProps extends RootVariants {
  children: ReactNode;
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
      {open && <div className={root({ mode, color })}>{children}</div>}
    </NoticeContext.Provider>
  );
};

const title = tv({
  slots: {
    icon: "Notice__Icon h-auto w-full",
    heading: "mb-.25 font-bold",
  },
  variants: {
    mode: {
      inline: {
        heading: "text-sm",
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
      class: "text-gray-500 dark:text-gray-200",
    },
    {
      slots: ["icon", "heading"],
      color: "gray",
      class: "text-primary-500 dark:text-primary-200",
    },
    {
      slots: ["icon", "heading"],
      color: "gray",
      class: "text-secondary-500 dark:text-secondary-200",
    },
    {
      slots: ["icon", "heading"],
      color: "gray",
      class: "text-success-500 dark:text-success-200",
    },
    {
      slots: ["icon", "heading"],
      color: "gray",
      class: "text-warning-500 dark:text-warning-200",
    },
    {
      slots: ["icon", "heading"],
      color: "gray",
      class: "text-error-500 dark:text-error-200",
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

export default {
  Root,
  Title,
};
