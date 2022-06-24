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
      <span data-h2-display="b(flex)" data-h2-align-items="b(center)">
        <span>{children}</span>
        <ChevronDownIcon
          style={{ height: "1rem", width: "1rem", marginLeft: "0.25rem" }}
        />
      </span>
    </ReachButton>
  );
};

export default MenuButton;
