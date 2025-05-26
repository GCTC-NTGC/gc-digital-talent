import { HTMLAttributes } from "react";

import Heading, { HeadingProps, type HeadingLevel } from "../Heading";
import { IconType } from "../../types";

export interface TocHeadingProps {
  as?: HeadingLevel;
  size?: HeadingLevel;
  icon?: IconType;
  color?: HeadingProps["color"];
}

const TOCHeading = ({
  icon,
  children,
  as = "h2",
  size = "h3",
  ...rest
}: TocHeadingProps & Omit<HTMLAttributes<HTMLHeadingElement>, "color">) => (
  <Heading level={as} size={size} icon={icon} {...rest}>
    {children}
  </Heading>
);

export default TOCHeading;
