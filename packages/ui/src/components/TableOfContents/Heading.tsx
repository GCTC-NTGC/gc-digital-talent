import React, { HTMLAttributes } from "react";

import Heading, { type HeadingLevel } from "../Heading";
import { IconType } from "../../types";

import "./heading.css";

export interface HeadingProps {
  as?: HeadingLevel;
  size?: HeadingLevel;
  icon?: IconType;
}

const TOCHeading = ({
  icon,
  children,
  as = "h2",
  size = "h3",
  ...rest
}: HeadingProps & Omit<HTMLAttributes<HTMLHeadingElement>, "color">) => {
  const Icon = icon;

  return (
    <Heading level={as} size={size} Icon={Icon} {...rest}>
      {children}
    </Heading>
  );
};

export default TOCHeading;
