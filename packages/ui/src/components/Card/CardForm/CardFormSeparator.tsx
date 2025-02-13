import { ComponentProps } from "react";

import Separator from "../../Separator";

type CardFormSeparatorProps = Omit<
  ComponentProps<typeof Separator>,
  "decorative" | "orientation" | "space"
>;

const CardFormSeparator = ({ ...rest }: CardFormSeparatorProps) => {
  return (
    <div data-h2-margin="base(0 -x1) l-tablet(0 -x1.5)">
      <Separator decorative orientation="horizontal" space="none" {...rest} />
    </div>
  );
};

export default CardFormSeparator;
