import { ComponentProps } from "react";

import Button from "../Button";

function MetaDataButton({ children, ...rest }: ComponentProps<typeof Button>) {
  // default styling to match the accordion
  return (
    <Button type="button" mode="inline" color="primary" size="sm" {...rest}>
      {children}
    </Button>
  );
}

export default MetaDataButton;
