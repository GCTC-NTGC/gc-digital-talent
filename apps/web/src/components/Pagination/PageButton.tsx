import React from "react";

import { Button, ButtonProps } from "@gc-digital-talent/ui";

type PageButtonProps = Omit<ButtonProps, "mode" | "ref">;

const PageButton = (props: PageButtonProps) => (
  <Button mode="inline" fontSize="caption" {...props} />
);

export default PageButton;
