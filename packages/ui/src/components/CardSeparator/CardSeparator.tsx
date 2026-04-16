import type { ComponentProps } from "react";
import { tv } from "tailwind-variants";

import Separator from "../Separator";

const cardSeparator = tv({
  variants: {
    // should match the spaces from Card.tsx
    space: {
      none: "",
      xs: "-mx-3",
      sm: "-mx-4",
      md: "-mx-6",
      lg: "-mx-6 sm:-mx-9",
    },
  },
});

const CardSeparator = ({
  orientation = "horizontal",
  space = "sm",
  ...rest
}: ComponentProps<typeof Separator>) => {
  return (
    <div className={cardSeparator({ space })}>
      <Separator decorative orientation={orientation} space={space} {...rest} />
    </div>
  );
};

export default CardSeparator;
