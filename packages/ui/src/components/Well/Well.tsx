import { DetailedHTMLProps, HTMLAttributes, ReactNode } from "react";
import { tv, type VariantProps } from "tailwind-variants";

const well = tv({
  base: "rounded-md border",
  variants: {
    color: {
      primary:
        "border-primary-700 bg-primary-100 text-primary-700 dark:border-primary-100 dark:bg-primary-700 dark:text-primary-100",
      secondary:
        "border-secondary-700 bg-secondary-100 text-secondary-700 dark:border-secondary-100 dark:bg-secondary-700 dark:text-secondary-100",
      success:
        "border-success-700 bg-success-100 text-success-700 dark:border-success-100 dark:bg-success-700 dark:text-success-100",
      warning:
        "border-warning-700 bg-warning-100 text-warning-700 dark:border-warning-100 dark:bg-warning-700 dark:text-warning-100",
      error:
        "border-error-700 bg-error-100 text-error-700 dark:border-error-100 dark:bg-error-700 dark:text-error-100",
      black:
        "border-gray-600 bg-gray-100/20 text-gray-700 dark:border-gray-100 dark:bg-gray-700 dark:text-gray-100",
    },
    fontSize: {
      body: "p-6",
      caption: "p-3 text-sm",
    },
  },
});

type WellVariants = VariantProps<typeof well>;

export interface WellProps
  extends WellVariants,
    Omit<
      DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
      "color"
    > {
  children: ReactNode;
}

const Well = ({
  children,
  color = "black",
  fontSize = "body",
  className,
  ...rest
}: WellProps) => {
  return (
    <div className={well({ color, fontSize, class: className })} {...rest}>
      {children}
    </div>
  );
};

export default Well;
