import React from "react";

import { Heading } from "@gc-digital-talent/ui";

export interface PageHeaderProps {
  icon?: React.FC<React.SVGProps<SVGSVGElement>>;
  subtitle?: React.ReactNode;
  children?: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  icon,
  subtitle,
  children,
  ...rest
}) => {
  const Icon = icon || null;

  if (subtitle) {
    return (
      <>
        <Heading level="h1" {...rest}>
          {Icon && (
            <Icon
              className="page-header__icon"
              data-h2-margin="base(0, x1, 0, 0)"
              data-h2-width="base(x2)"
              data-h2-vertical-align="base(middle)"
            />
          )}
          <span data-h2-vertical-align="base(middle)">{children}</span>
        </Heading>
        <Heading
          level="h2"
          data-h2-padding="base(0, 0, x1, 0) p-tablet(0, 0, x1, x3)"
          data-h2-margin="base(x1, 0, x.5, 0)"
          {...rest}
        >
          {subtitle}
        </Heading>
      </>
    );
  }
  return (
    <Heading level="h1" {...rest}>
      {Icon && (
        <Icon
          className="page-header__icon"
          data-h2-margin="base(0, x1, 0, 0)"
          data-h2-width="base(x2)"
          data-h2-vertical-align="base(middle)"
        />
      )}
      <span data-h2-vertical-align="base(middle)">{children}</span>
    </Heading>
  );
};

export default PageHeader;
