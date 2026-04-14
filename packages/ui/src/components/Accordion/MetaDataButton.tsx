import { forwardRef } from "react";

import type { ButtonProps } from "../Button";
import Button from "../Button";

const MetaDataButton = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, ...rest }, forwardedRef) => (
    <Button
      ref={forwardedRef}
      // default styling to match the accordion
      type="button"
      mode="inline"
      color="primary"
      size="sm"
      {...rest}
    >
      {children}
    </Button>
  ),
);

export default MetaDataButton;
