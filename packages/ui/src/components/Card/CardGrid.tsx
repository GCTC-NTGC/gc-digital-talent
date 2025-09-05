import { JSX } from "react";
import { tv, VariantProps } from "tailwind-variants";

import { PolymorphicProps } from "../../types";

const grid = tv({
  base: [
    "grid gap-px overflow-hidden bg-gray",
    "group-[.Card--lg]:-m-6 group-[.Card--md]:-m-6 group-[.Card--sm]:-m-4 group-[.Card--xs]:-m-3 group-[.Card--lg]:sm:-m-9",
  ],
  variants: {
    columns: {
      2: "grid-cols-1 sm:grid-cols-2",
      3: "grid-cols-1 sm:grid-cols-3",
      4: "grid-cols-1 sm:grid-cols-2 md:grid-cols-4",
    },
  },
  defaultVariants: {
    columns: 3,
  },
});

type GridVariants = VariantProps<typeof grid>;

type GridProps<T extends keyof JSX.IntrinsicElements = "div"> =
  PolymorphicProps<T, GridVariants & { className?: string }>;

export const Grid = ({
  as = "div",
  columns,
  className,
  children,
  ...rest
}: GridProps) => {
  const El = as;
  return (
    <El className={grid({ columns, class: className })} {...rest}>
      {children}
    </El>
  );
};

const item = tv({
  base: "bg-white group-[.Card--lg]:p-6 group-[.Card--md]:p-6 group-[.Card--sm]:p-4 group-[.Card--xs]:p-3 group-[.Card--lg]:sm:p-9 dark:bg-gray-600",
});

type GridItemProps<T extends keyof JSX.IntrinsicElements = "div"> =
  PolymorphicProps<T, { className?: string }>;

export const GridItem = ({
  as = "div",
  className,
  children,
  ...rest
}: GridItemProps) => {
  const El = as;
  return (
    <El className={item({ class: className })} {...rest}>
      {children}
    </El>
  );
};
