import { HTMLAttributes } from "react";

import Heading from "../Heading/Heading";
import { HeadingLevel } from "../Heading/types";
import { IconType, Color } from "../../types";

export interface HeadingProps {
  as?: HeadingLevel;
  size?: HeadingLevel;
  icon?: IconType;
  color?: Color;
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
