import { tv, VariantProps } from "tailwind-variants";

import { IconType } from "../types";

export const btn = tv({
  slots: {
    base: "",
    leadingIcon: "",
    trailingIcon: "",
  },
  variants: {
    mode: {
      text: "",
      inline: "",
      solid: "",
      placeholder: "",
    },
    color: {
      primary: {},
    },
    size: {
      sm: {},
      md: {},
      lg: {},
    },
    block: {
      true: {},
      false: {},
    },
  },
  compoundVariants: [],
});

export type ButtonLinkVariants = VariantProps<typeof btn>;

export interface BaseButtonLinkProps extends ButtonLinkVariants {
  icon?: IconType;
  utilityIcon?: IconType;
  counter?: number;
}

export const iconBtn = tv({
  slots: {
    base: "group/iconBtn inline-block rounded-full border-0 bg-transparent p-1 leading-none transition-colors duration-200 ease-linear outline-none focus-visible:bg-focus focus-visible:text-black",
    icon: "align-middle",
  },
  variants: {
    color: {
      primary: {
        base: "text-primary-500 hover:bg-primary-200/90 hover:text-primary-700 dark:text-primary-300",
      },
      secondary: {
        base: "text-secondary-500 hover:bg-secondary-100 hover:text-secondary-700 dark:text-secondary-300",
      },
      success: {
        base: "text-success-500 hover:bg-success-100 hover:text-success-700 dark:text-success-300",
      },
      warning: {
        base: "text-warning-500 hover:bg-warning-100 hover:text-warning-700 dark:text-warning-300",
      },
      error: {
        base: "text-error-500 hover:bg-error-100 hover:text-error-700 dark:text-error-300",
      },
    },
    size: {
      sm: {
        icon: "size-4.5",
      },
      md: {
        icon: "size-5",
      },
      lg: {
        icon: "size-6",
      },
    },
  },
  defaultVariants: {
    color: "primary",
    size: "md",
  },
});

export type IconButtonVariants = VariantProps<typeof iconBtn>;

export interface BaseIconButtonLinkProps extends IconButtonVariants {
  icon: IconType;
  label: string;
}
