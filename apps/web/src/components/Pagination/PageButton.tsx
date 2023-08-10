import React from "react";

import { Button, ButtonProps } from "@gc-digital-talent/ui";

type PageButtonProps = Omit<ButtonProps, "mode" | "ref">;

const PageButton = (props: PageButtonProps) => (
  <Button mode="inline" data-h2-font-size="base(caption)" {...props} />
);

export default PageButton;
