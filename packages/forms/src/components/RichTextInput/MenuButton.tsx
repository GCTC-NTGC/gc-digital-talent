import { ReactNode, forwardRef } from "react";

import { Button, ButtonProps } from "@gc-digital-talent/ui";

type MenuButtonProps = {
  onClick?: ButtonProps["onClick"];
  icon?: ButtonProps["icon"];
  utilityIcon?: ButtonProps["utilityIcon"];
  disabled?: ButtonProps["disabled"];
  active?: boolean;
  children: ReactNode;
};

const MenuButton = forwardRef<HTMLButtonElement, MenuButtonProps>(
  ({ active, ...rest }, ref) => (
    <Button
      ref={ref}
      mode="text"
      type="button"
      color={active ? "secondaryDarkFixed" : "whiteFixed"}
      fontSize="caption"
      {...rest}
    />
  ),
);

export default MenuButton;
