import { ElementType, ReactNode } from "react";

import { IconType } from "../../types";
import { CardColor as CardFlatColor } from "../Card/CardFlat/types";
import { LinkProps } from "../Link";

type CardColor = Extract<CardFlatColor, "primary" | "secondary">;

export interface TaskCardProps {
  icon?: IconType;
  title: ReactNode;
  headingColor?: CardColor;
  link: ElementType<LinkProps>;
  children?: ReactNode;
}

const colorMap: Record<CardColor, Record<string, string>> = {
  primary: {
    "data-h2-background-color": "base:all(primary.lightest)",
    "data-h2-color": "base:all(primary.darkest)",
    "data-h2-border-bottom": "base:all(primary.darkest)",
  },
  secondary: {
    "data-h2-background-color": "base:all(secondary.lightest)",
    "data-h2-color": "base:all(secondary.darkest)",
    "data-h2-border-bottom": "base:all(secondary.darkest)",
  },
};

const TaskCard = ({
  icon,
  title,
  headingColor = "primary",
  link,
  children,
}: TaskCardProps) => {
  const Icon = icon;
  return (
    <div
      data-h2-shadow="base(larger)"
      data-h2-radius="base(rounded)"
      data-h2-background-clip="base(border-box)"
    >
      {/* heading  */}
      <div
        {...colorMap[headingColor]}
        data-h2-border-bottom-width="base(1px)"
        data-h2-border-bottom-style="base(solid)"
        data-h2-padding="base(x1 x1.5 x1 x1.5)"
        data-h2-display="base(flex)"
        data-h2-gap="base(x2)"
        data-h2-align-items="base(center)"
        data-h2-radius="base(rounded rounded 0 0)"
      >
        {/* wrapper */}
        <div
          data-h2-flex-grow="base(2)"
          data-h2-display="base(flex)"
          data-h2-gap="base(x0.5)"
          data-h2-align-items="base(center)"
        >
          {Icon && (
            <Icon data-h2-height="base(x0.85)" data-h2-width="base(auto)" />
          )}
          {title}
        </div>
        {link}
      </div>
      <div>{children}</div>
    </div>
  );
};

export default TaskCard;
