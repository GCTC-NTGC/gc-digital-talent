import React from "react";

import { Button, ButtonProps } from "@gc-digital-talent/ui";

type MenuButtonProps = {
  onClick?: ButtonProps["onClick"];
  icon?: ButtonProps["icon"];
  utilityIcon?: ButtonProps["utilityIcon"];
  disabled?: ButtonProps["disabled"];
  active?: boolean;
  children: React.ReactNode;
};

const MenuButton = ({ active, ...rest }: MenuButtonProps) => (
  <Button
    mode="solid"
    color={active ? "white" : "black"}
    data-h2-padding="base(x.125 x.25)"
    data-h2-font-size="base(caption)"
    {...rest}
  />
);

export default MenuButton;
