import { ReactNode, forwardRef } from "react";

import { Button, ButtonProps } from "@gc-digital-talent/ui";

interface MenuButtonProps {
  onClick?: ButtonProps["onClick"];
  icon?: ButtonProps["icon"];
  utilityIcon?: ButtonProps["utilityIcon"];
  disabled?: ButtonProps["disabled"];
  active?: boolean;
  children: ReactNode;
}

const MenuButton = forwardRef<HTMLButtonElement, MenuButtonProps>(
  ({ active, ...rest }, ref) => (
    <Button
      ref={ref}
      mode="inline"
      type="button"
      color={active ? "secondary" : "white"}
      fixedColor
      size="sm"
      {...rest}
    />
  ),
);

export default MenuButton;
