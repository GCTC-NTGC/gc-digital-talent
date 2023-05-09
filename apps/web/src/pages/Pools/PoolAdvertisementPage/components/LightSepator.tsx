import React from "react";

import { Separator } from "@gc-digital-talent/ui";

type LightSeparatorProps = React.ComponentPropsWithoutRef<typeof Separator>;

const LightSeparator = ({
  orientation = "horizontal",
  decorative = true,
  ...rest
}: LightSeparatorProps) => (
  <Separator
    orientation={orientation}
    decorative={decorative}
    data-h2-background-color="base(gray.lighter)"
    data-h2-margin="base(x1, 0)"
    {...rest}
  />
);

export default LightSeparator;
