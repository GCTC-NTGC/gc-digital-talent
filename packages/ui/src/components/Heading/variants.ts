import { tv } from "tailwind-variants";

const headingBase = tv({
  slots: {
    base: "",
    icon: "inline-block h-auto shrink-0 align-middle",
  },
  variants: {
    color: {
      primary:   { icon: "text-primary-500 dark:text-primary-300 iap:dark:text-primary-200" },
      secondary: { icon: "text-secondary iap:dark:text-secondary-100" },
      success:   { icon: "text-success" },
      warning:   { icon: "text-warning" },
      error:     { icon: "text-error" },
    },
    center: {
      true: { base: "justify-center text-center" },
      xs: { base: "justify-center xs:justify-start text-center xs:text-left" },
    },
  },
});

export default headingBase;
