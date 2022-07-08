import React from "react";
import Link from "./Link";
import type { LinkProps } from "./Link";

export interface IconLinkProps extends LinkProps {
  icon?: React.FC<{ className?: string; style?: Record<string, string> }>;
}

const IconLink: React.FC<IconLinkProps> = ({ icon, children, ...rest }) => {
  const Icon = icon || null;
  return (
    <Link {...rest}>
      <span>
        {Icon && (
          <Icon
            data-h2-margin="b(-2px, x.5, 0, 0)"
            data-h2-width="b(x1)"
            data-h2-vertical-align="b(middle)"
          />
        )}
        <span data-h2-text-decoration="b(underline)">{children}</span>
      </span>
    </Link>
  );
};

export default IconLink;
