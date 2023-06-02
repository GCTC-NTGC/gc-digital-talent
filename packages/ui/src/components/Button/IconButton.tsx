import React from "react";

import Button from "./Button";

const IconButton = React.forwardRef<
  React.ElementRef<typeof Button>,
  React.ComponentPropsWithoutRef<typeof Button>
>((props, ref) => {
  return <Button ref={ref} {...props} />;
});

export default IconButton;
