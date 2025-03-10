import { ComponentProps } from "react";

import Separator from "../Separator";

const CardSeparator = ({
  orientation = "horizontal",
  space = "sm",
  ...rest
}: ComponentProps<typeof Separator>) => {
  return (
    <div data-h2-margin="base(0 -x1)">
      <Separator decorative orientation={orientation} space={space} {...rest} />
    </div>
  );
};

export default CardSeparator;
