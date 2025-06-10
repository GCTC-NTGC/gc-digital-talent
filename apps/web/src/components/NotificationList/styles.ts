import { tv } from "tailwind-variants";

export const linkStyles = tv({
  base: "no-underline outline-none hover:text-primary-600 dark:hover:text-primary-200",
  variants: {
    isUnread: {
      true: "font-bold",
    },
    isDisabled: {
      true: "pointer-events-none opacity-60",
    },
  },
});
