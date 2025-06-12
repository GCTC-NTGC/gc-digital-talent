import { tv, VariantProps } from "tailwind-variants";

import { IconType } from "../../types";

export const cta = tv({
  slots: {
    base: "group/cta items-stretch overflow-hidden rounded-md bg-transparent p-0 font-bold shadow-md transition-all duration-200 ease-linear outline-none hover:shadow-lg",
    icon: "grid place-items-center rounded-l-md border-3 p-2.25 group-focus-visible/cta:border-focus group-focus-visible/cta:bg-focus group-focus-visible/cta:text-black",
    text: "rounded-r-md border-3 border-transparent bg-white px-5.25 py-2.25 text-center text-black underline dark:bg-gray-600 dark:text-white",
  },
  variants: {
    color: {
      primary: {
        icon: "border-primary bg-primary text-black group-hover/cta:bg-primary-200 dark:group-hover/cta:bg-primary-700 dark:group-hover/cta:text-white iap:text-white",
      },
      secondary: {
        icon: "border-secondary bg-secondary text-black group-hover/cta:bg-secondary-200 dark:group-hover/cta:bg-secondary-700 dark:group-hover/cta:text-white iap:text-white",
      },
      success: {
        icon: "border-success bg-success text-black group-hover/cta:bg-success-200 dark:group-hover/cta:bg-success-700 dark:group-hover/cta:text-white",
      },
      warning: {
        icon: "border-warning bg-warning text-black group-hover/cta:bg-warning-200 dark:group-hover/cta:bg-warning-700 dark:group-hover/cta:text-white",
      },
      error: {
        icon: "border-error bg-error text-black group-hover/cta:bg-error-200 dark:group-hover/cta:bg-error-700 dark:group-hover/cta:text-white",
      },
    },
    block: {
      true: {
        base: "flex",
      },
      false: {
        base: "inline-flex",
      },
    },
  },
});

type CTAVariants = VariantProps<typeof cta>;

export interface BaseCTAProps extends CTAVariants {
  icon: IconType;
}
