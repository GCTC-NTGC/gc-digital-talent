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
      <span data-h2-display="b(flex)" data-h2-align-items="b(center)">
        {Icon && (
          <Icon
            data-h2-margin="b(auto, x.25, auto, auto)"
            style={{ height: "1rem", width: "1rem" }}
          />
        )}
        <span>{children}</span>
      </span>
    </Link>
  );
};

export default IconLink;
