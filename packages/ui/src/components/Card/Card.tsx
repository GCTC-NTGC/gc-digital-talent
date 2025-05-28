import { ComponentPropsWithoutRef } from "react";
import { tv, VariantProps } from "tailwind-variants";

import Separator from "../Separator";

const card = tv({
  base: "rounded-md bg-white text-black shadow-xl dark:bg-gray-600 dark:text-white",
  variants: {
    space: {
      sm: "p-4 [&>.CardSeparator]:-mx-4",
      md: "p-6 [&>.CardSeparator]:-mx-6",
      lg: "p-6 sm:p-9 [&>.CardSeparator]:-mx-6 sm:[&>.CardSeparator]:-mx-9",
    },
  },
});

type CardVariants = VariantProps<typeof card>;

export interface CardProps
  extends CardVariants,
    ComponentPropsWithoutRef<"div"> {}

const Card = ({ space = "md", className, ...rest }: CardProps) => (
  <div className={card({ space })} {...rest} />
);

const CardSeparator = (props: ComponentPropsWithoutRef<"hr" | "div">) => (
  <div className="CardSeparator">
    <Separator decorative orientation="horizontal" space="none" {...props} />
  </div>
);

Card.Separator = CardSeparator;

export default Card;
