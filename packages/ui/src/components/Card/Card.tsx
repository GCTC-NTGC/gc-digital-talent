import { ComponentPropsWithoutRef } from "react";
import { tv, VariantProps } from "tailwind-variants";

import Separator from "../Separator";
import { SeparatorProps } from "../Separator/Separator";
import { Grid, GridItem } from "./CardGrid";

const card = tv({
  base: "rounded-md bg-white text-black shadow-xl dark:bg-gray-600 dark:text-white",
  variants: {
    space: {
      xs: "p-3",
      sm: "p-4",
      md: "p-6",
      lg: "p-6 sm:p-9",
    },
  },
});

type CardVariants = VariantProps<typeof card>;

export interface CardProps
  extends CardVariants, ComponentPropsWithoutRef<"div"> {
  as?: "article" | "div";
}

const Card = ({ as = "div", space = "md", className, ...rest }: CardProps) => {
  const El = as;
  return (
    <El
      className={card({
        space,
        class: [className, `group Card--${space}`],
      })}
      {...rest}
    />
  );
};

const CardSeparator = (props: SeparatorProps) => (
  <div className="group-[.Card--lg]:-mx-6 group-[.Card--md]:-mx-6 group-[.Card--sm]:-mx-4 group-[.Card--xs]:-mx-3 group-[.Card--lg]:sm:-mx-9">
    <Separator decorative orientation="horizontal" space="none" {...props} />
  </div>
);

Card.Separator = CardSeparator;
Card.Grid = Grid;
Card.GridItem = GridItem;

export default Card;
