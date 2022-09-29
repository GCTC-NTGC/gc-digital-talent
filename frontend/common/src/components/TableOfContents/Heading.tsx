import React, { HTMLAttributes } from "react";

import Heading, { type HeadingLevel } from "../Heading";

import "./heading.css";

export interface HeadingProps {
  as?: HeadingLevel;
  icon?: React.FC<React.HTMLAttributes<HTMLOrSVGElement>>;
}

const TOCHeading: React.FC<
  HeadingProps & Omit<HTMLAttributes<HTMLHeadingElement>, "color">
> = ({ icon, children, as = "h2", ...rest }) => {
  const Icon = icon;

  return (
    <Heading level={as} Icon={Icon} {...rest}>
      {children}
    </Heading>
  );
};

export default TOCHeading;
