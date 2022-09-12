import React, { HTMLAttributes } from "react";

import Heading, { type HeadingLevel } from "../Heading";

import "./heading.css";

export interface HeadingProps {
  as?: HeadingLevel;
  icon?: React.FC<{ className: string }>;
}

const TOCHeading: React.FC<
  HeadingProps & HTMLAttributes<HTMLHeadingElement>
> = ({ icon, children, as = "h2", ...rest }) => {
  const Icon = icon || null;

  return (
    <Heading level={as} {...rest}>
      {Icon && (
        <Icon
          className="toc-heading__icon"
          data-h2-margin="base(0, x.5, 0, 0)"
          data-h2-position="base(relative)"
          data-h2-offset="base(3px, auto, auto, auto)"
          data-h2-width="base(x1.5)"
        />
      )}
      <span>{children}</span>
    </Heading>
  );
};

export default TOCHeading;
