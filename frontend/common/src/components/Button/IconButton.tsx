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
      <span data-h2-display="b(flex)" data-h2-align-items="b(center)">
        {Icon && (
          <Icon
            data-h2-margin="b(right, xs)"
            style={{ height: "1rem", width: "1rem" }}
          />
        )}
        <span>{children}</span>
      </span>
    </Button>
  );
};

export default IconButton;
