import { tv, VariantProps } from "tailwind-variants";

import { IconButtonProps } from "@gc-digital-talent/ui";

const statusBtn = tv({
  slots: {
    base: [
      "group flex min-w-max items-stretch justify-between overflow-hidden rounded-md",
      "cursor-pointer border-0 p-0 outline -outline-offset-1 transition-all duration-200",
      "focus-visible:bg-focus focus-visible:text-black focus-visible:outline-focus-700",
    ],
    text: "flex grow items-center p-4 leading-none font-bold",
    iconWrapper:
      "flex items-center justify-center px-2 group-focus-visible:bg-focus-700",
    iconContainer: [
      "flex items-center justify-center rounded-full p-1 transition-colors duration-200 ease-linear",
      "bg-transparent",
    ],
    icon: "size-5 align-middle transition-colors duration-200 ease-linear group-focus-visible:text-focus-100",
  },
  variants: {
    color: {
      primary: {
        base: "bg-primary-100 text-primary-700 outline-primary-700",
        iconWrapper: "bg-primary-700",
        iconContainer: "group-hover:bg-primary-100",
        icon: "text-primary-100 group-hover:text-primary-700",
      },
      secondary: {
        base: "bg-secondary-100 text-secondary-700 outline-secondary-700",
        iconWrapper: "bg-secondary-700",
        iconContainer: "group-hover:bg-secondary-100",
        icon: "text-secondary-100 group-hover:text-secondary-700",
      },
      success: {
        base: "bg-success-100 text-success-600 outline-success-700",
        iconWrapper: "bg-success-700",
        iconContainer: "group-hover:bg-success-100",
        icon: "text-success-100 group-hover:text-success-700",
      },
      warning: {
        base: "bg-warning-100 text-warning-700 outline-warning-700",
        iconWrapper: "bg-warning-700",
        iconContainer: "group-hover:bg-warning-100",
        icon: "text-warning-100 group-hover:text-warning-700",
      },
      error: {
        base: "bg-error-100 text-error-600 outline-error-700",
        iconWrapper: "bg-error-700",
        iconContainer: "group-hover:bg-error-100",
        icon: "text-error-100 group-hover:text-error-700",
      },
      black: {
        base: "bg-gray-100 text-gray-700 outline-gray-700",
        iconWrapper: "bg-gray-700",
        iconContainer: "group-hover:bg-gray-100",
        icon: "text-gray-100 group-hover:text-gray-700",
      },
    },
    block: {
      true: "w-full",
    },
  },
  defaultVariants: {
    color: "black",
  },
});

type StatusButtonVariants = VariantProps<typeof statusBtn>;

export interface StatusButtonProps
  extends Omit<IconButtonProps, "color">, StatusButtonVariants {}

const StatusButton = ({
  color,
  block,
  className,
  children,
  icon: Icon,
  ...rest
}: StatusButtonProps) => {
  const { base, text, iconWrapper, iconContainer, icon } = statusBtn({
    color,
    block,
  });

  return (
    <button className={base({ class: className })} {...rest}>
      <span className={text()}>{children}</span>
      <span className={iconWrapper()}>
        <span className={iconContainer()}>
          {Icon && <Icon className={icon()} />}
        </span>
      </span>
    </button>
  );
};

export default StatusButton;
