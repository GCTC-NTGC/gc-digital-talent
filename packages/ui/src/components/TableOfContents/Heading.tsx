import { HTMLAttributes } from "react";

import Heading, { type HeadingLevel } from "../Heading";
import { IconType, Color } from "../../types";

export interface HeadingProps {
  as?: HeadingLevel;
  size?: HeadingLevel;
  icon?: IconType;
  color?: Color;
  className?: string;
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
