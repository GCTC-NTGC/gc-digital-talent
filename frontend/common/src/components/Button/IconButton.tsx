import React from "react";
import Button from "./Button";
import type { ButtonProps } from "./Button";

// NOTE: We should find a way to not need to omit ref
export interface IconButtonProps extends Omit<ButtonProps, "ref"> {
  icon?: React.FC<{ className?: string; style?: Record<string, string> }>;
}

const IconButton: React.FC<IconButtonProps> = ({ icon, children, ...rest }) => {
  const Icon = icon || null;
  return (
    <Button {...rest}>
      <span data-h2-display="base(flex)" data-h2-align-items="base(center)">
        {Icon && (
          <Icon data-h2-margin="base(0, x.25, 0, 0)" data-h2-width="base(1rem)" />
        )}
        <span>{children}</span>
      </span>
    </Button>
  );
};

export default IconButton;
