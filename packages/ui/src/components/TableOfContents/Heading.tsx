import type { HTMLAttributes } from "react";

import Heading, { type HeadingProps, type HeadingRank } from "../Heading";
import type { IconType } from "../../types";

export interface TocHeadingProps {
  as?: HeadingRank;
  size?: HeadingRank;
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
  <Heading rank={as} size={size} icon={icon} {...rest}>
    {children}
  </Heading>
);

export default TOCHeading;
