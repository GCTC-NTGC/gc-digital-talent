import { ComponentPropsWithoutRef } from "react";
import { tv, VariantProps } from "tailwind-variants";

import Separator from "../Separator";
import { SeparatorProps } from "../Separator/Separator";

const card = tv({
  base: "rounded-md bg-white text-black shadow-xl dark:bg-gray-600 dark:text-white",
  variants: {
    space: {
      xs: "p-3 [&>.CardSeparator]:-mx-3",
      sm: "p-4 [&>.CardSeparator]:-mx-4",
      md: "p-6 [&>.CardSeparator]:-mx-6",
      lg: "p-6 sm:p-9 [&>.CardSeparator]:-mx-6 sm:[&>.CardSeparator]:-mx-9",
    },
  },
});

type CardVariants = VariantProps<typeof card>;

export interface CardProps
  extends CardVariants,
    ComponentPropsWithoutRef<"div"> {
  as?: "article" | "div";
}

const Card = ({ as = "div", space = "md", className, ...rest }: CardProps) => {
  const El = as;
  return <El className={card({ space, class: className })} {...rest} />;
};

const CardSeparator = (props: SeparatorProps) => (
  <div className="CardSeparator">
    <Separator decorative orientation="horizontal" space="none" {...props} />
  </div>
);

Card.Separator = CardSeparator;

export default Card;
