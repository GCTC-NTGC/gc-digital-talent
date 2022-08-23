import React from "react";
import Link from "./Link";
import type { LinkProps } from "./Link";

export interface IconLinkProps extends LinkProps {
  icon?: React.FC<{ className?: string; style?: Record<string, string> }>;
}

const IconLink: React.FC<IconLinkProps> = ({
  icon,
  children,
  block,
  ...rest
}) => {
  const Icon = icon || null;
  return (
    <Link block={block} {...rest}>
      <span
        data-h2-flex-grid="base(center, 0, x.4, 0)"
        data-h2-justify-content="base(center)"
      >
        {Icon && (
          <div data-h2-flex-item="base(content)">
            <Icon
              data-h2-width="base(x1)"
              data-h2-vertical-align="base(bottom)"
            />
          </div>
        )}
        <div data-h2-flex-item="base(content)">
          <span data-h2-text-decoration="base(underline)">{children}</span>
        </div>
      </span>
    </Link>
  );
};

export default IconLink;
