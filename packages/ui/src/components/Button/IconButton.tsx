import React from "react";

import Button from "./Button";
import { IconType } from "../../types";

export type IconButtonProps = React.ComponentPropsWithoutRef<typeof Button> & {
  icon?: IconType;
};

const IconButton = React.forwardRef<
  React.ElementRef<typeof Button>,
  IconButtonProps
>(({ icon, children, ...rest }, ref) => {
  const Icon = icon || null;
  return (
    <Button ref={ref} {...rest}>
      <span data-h2-display="base(flex)" data-h2-align-items="base(center)">
        {Icon && (
          <Icon
            data-h2-margin="base(0, x.25, 0, 0)"
            data-h2-width="base(1rem)"
          />
        )}
        <span>{children}</span>
      </span>
    </Button>
  );
});

export default IconButton;
