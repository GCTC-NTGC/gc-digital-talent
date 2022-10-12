import React, { HTMLAttributes } from "react";

import Heading, { type HeadingLevel } from "../Heading";

import "./heading.css";

export interface HeadingProps {
  as?: HeadingLevel;
  size?: HeadingLevel;
  icon?: React.FC<React.HTMLAttributes<HTMLOrSVGElement>>;
}

const TOCHeading: React.FC<
  HeadingProps & Omit<HTMLAttributes<HTMLHeadingElement>, "color">
> = ({ icon, children, as = "h2", size = "h3", ...rest }) => {
  const Icon = icon;

  return (
    <Heading level={as} size={size} Icon={Icon} {...rest}>
      {children}
    </Heading>
  );
};

export default TOCHeading;
