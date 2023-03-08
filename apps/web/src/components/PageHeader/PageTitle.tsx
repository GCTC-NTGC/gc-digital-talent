import React from "react";

import { Heading } from "@gc-digital-talent/ui";

import { IconType } from "./types";

export interface PageTitleProps
  extends Omit<React.HTMLProps<HTMLHeadingElement>, "size" | "color"> {
  icon?: IconType;
  subtitle?: React.ReactNode;
  children?: React.ReactNode;
}

const PageTitle = ({ icon, subtitle, children, ...rest }: PageTitleProps) => {
  const Icon = icon || null;

  if (subtitle) {
    return (
      <>
        <Heading
          level="h1"
          data-h2-font-weight="base(400)"
          data-h2-display="base(flex)"
          data-h2-align-items="base(center)"
          {...rest}
        >
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
          size="h5"
          data-h2-padding="base(0) p-tablet(0, 0, 0, x3)"
          data-h2-margin="base(0, 0, x.5, 0)"
          data-h2-font-weight="base(700)"
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

export default PageTitle;
