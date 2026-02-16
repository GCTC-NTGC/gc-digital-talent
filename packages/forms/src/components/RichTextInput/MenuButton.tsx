import { ReactNode, forwardRef } from "react";
import { tv } from "tailwind-variants";

import { Button, ButtonProps } from "@gc-digital-talent/ui";

const menuBtn = tv({
  base: "font-normal",
  variants: {
    active: {
      true: "font-bold no-underline [&_span]:no-underline",
    },
  },
});

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
      className={menuBtn({ active })}
      color="white"
      fixedColor
      size="sm"
      {...rest}
    />
  ),
);

export default MenuButton;
