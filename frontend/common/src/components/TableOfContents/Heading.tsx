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
    <Heading
      level={as}
      data-h2-display="base(flex)"
      data-h2-align-items="base(center)"
      data-h2-margin="base(0, 0, x1, 0)"
      data-h2-justify-content="base(start)"
      {...rest}
    >
      {Icon && <Icon className="toc-heading__icon" />}
      <span>{children}</span>
    </Heading>
  );
};

export default TOCHeading;
