import React from "react";
import { ChevronDownIcon } from "@heroicons/react/outline";
import {
  useMenuButtonContext,
  MenuButton as ReachButton,
} from "@reach/menu-button";

import Button, { type ButtonProps } from "../Button";

type DropdownMenuButtonProps = Pick<ButtonProps, "color"> &
  React.HTMLAttributes<HTMLButtonElement>;

const MenuButton: React.FC<DropdownMenuButtonProps> = ({
  children,
  ...rest
}) => {
  const { isExpanded } = useMenuButtonContext();
  return (
    <ReachButton as={Button} mode={isExpanded ? "solid" : "outline"} {...rest}>
      <span data-h2-display="base(flex)" data-h2-align-items="base(center)">
        <span>{children}</span>
        <ChevronDownIcon
          data-h2-height="base(x1)"
          data-h2-width="base(x1)"
          data-h2-margin="base(0, 0, 0, x.125)"
        />
      </span>
    </ReachButton>
  );
};

export default MenuButton;
