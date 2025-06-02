import { tv, VariantProps } from "tailwind-variants";

import { IconType } from "../types";

export const btn = tv({
  slots: {
    base: "group/btn items-center justify-center gap-x-1.5 font-bold transition-colors duration-200 ease-linear outline-none focus-visible:bg-focus focus-visible:text-black",
    leadingIcon: "",
    trailingIcon: "",
    label: "leading-none underline",
  },
  variants: {
    mode: {
      text: {
        base: "font-normal",
      },
      inline: "",
      solid: {
        base: "rounded-md border-3 focus-visible:border-focus",
      },
      placeholder: {
        base: "rounded-md border-3 border-dashed focus-visible:border-focus",
      },
    },
    color: {
      primary: {},
      secondary: {},
      success: {},
      warning: {},
      error: {},
      black: {},
      white: {},
    },
    size: {
      sm: {
        label: "text-sm/none",
      },
      md: {},
      lg: {
        label: "text-lg/none",
      },
    },
    block: {
      true: {
        base: "flex w-full text-center",
      },
      false: {
        base: "inline-flex",
      },
    },
    disabled: {
      true: {},
      false: {},
    },
  },
  compoundVariants: [
    // Solid Colour Variants
    {
      color: "primary",
      mode: "solid",
      class: {
        base: "border-primary bg-primary text-black hover:bg-primary-100",
      },
    },
    {
      color: "secondary",
      mode: "solid",
      class: {
        base: "border-secondary bg-secondary text-black hover:bg-secondary-100",
      },
    },
    {
      color: "success",
      mode: "solid",
      class: {
        base: "border-success bg-success text-black hover:bg-success-100",
      },
    },
    {
      color: "warning",
      mode: "solid",
      class: {
        base: "border-warning bg-warning text-black hover:bg-warning-100",
      },
    },
    {
      color: "error",
      mode: "solid",
      class: {
        base: "border-error-300 bg-error-300 hover:bg-error-100",
      },
    },
    {
      color: "black",
      mode: "solid",
      class: {
        base: "border-gray-700 bg-gray-700 text-white hover:bg-gray-100 hover:text-black",
      },
    },
    {
      color: "white",
      mode: "solid",
      class: {
        base: "border-gray-100 bg-gray-100 text-black hover:border-gray-300 hover:bg-gray-600 hover:text-white",
      },
    },

    // Outline, text, placeholder colour variants
    {
      color: "primary",
      mode: ["inline", "text", "placeholder"],
      class: {
        base: "text-primary-600 hover:text-primary-700 dark:text-primary-200 dark:hover:text-primary-100",
      },
    },
    {
      color: "secondary",
      mode: ["inline", "text", "placeholder"],
      class: {
        base: "text-secondary-600 hover:text-secondary-700 dark:text-secondary-200 dark:hover:text-secondary-100",
      },
    },
    {
      color: "success",
      mode: ["inline", "text", "placeholder"],
      class: {
        base: "text-success-600 hover:text-success-700 dark:text-success-200 dark:hover:text-success-100",
      },
    },
    {
      color: "warning",
      mode: ["inline", "text", "placeholder"],
      class: {
        base: "text-warning-600 hover:text-warning-700 dark:text-warning-200 dark:hover:text-warning-100",
      },
    },
    {
      color: "error",
      mode: ["inline", "text", "placeholder"],
      class: {
        base: "text-error-600 hover:text-error-700 dark:text-error-100 dark:hover:text-error-200",
      },
    },
    {
      color: "black",
      mode: ["inline", "text", "placeholder"],
      class: {
        base: "text-black hover:text-gray-700 dark:text-white dark:hover:text-gray-100",
      },
    },
    {
      color: "white",
      mode: ["inline", "text", "placeholder"],
      class: {
        base: "text-white hover:text-gray-100",
      },
    },

    // Size variants
    {
      mode: ["solid", "placeholder"],
      size: "sm",
      class: {
        base: "px-3 py-2",
      },
    },
    {
      mode: ["solid", "placeholder"],
      size: "md",
      class: {
        base: "px-5 py-2",
      },
    },
    {
      mode: ["solid", "placeholder"],
      size: "lg",
      class: {
        base: "px-6 py-2",
      },
    },

    // Disabled: Must be at bottom for cascade
    {
      disabled: true,
      mode: "solid",
      class:
        "border-gray-200 bg-gray-100 text-black hover:bg-gray-100 hover:text-black",
    },
  ],
  compoundSlots: [
    {
      slots: ["leadingIcon", "trailingIcon"],
      size: "sm",
      class: "size-4.5",
    },
    {
      slots: ["leadingIcon", "trailingIcon"],
      size: "md",
      class: "size-5",
    },
    {
      slots: ["leadingIcon", "trailingIcon"],
      size: "lg",
      class: "size-6",
    },
  ],

  defaultVariants: {
    color: "primary",
    size: "sm",
    mode: "solid",
    disabled: false,
  },
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
        base: "text-primary-500 hover:bg-primary-100 hover:text-primary-700 dark:text-primary-300",
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
      black: {
        base: "text-black hover:bg-gray-100 dark:text-white dark:hover:text-black",
      },
      white: {
        base: "text-whitw hover:bg-gray-100 dark:text-black dark:hover:text-white",
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
    disabled: {
      true: {
        base: "text-gray",
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
