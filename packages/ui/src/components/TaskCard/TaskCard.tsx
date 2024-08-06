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
    "data-h2-color": "base:all(primary.darker)",
  },
  secondary: {
    "data-h2-background-color": "base:all(secondary.lightest)",
    "data-h2-color": "base:all(secondary.darker)",
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
    <>
      <div {...colorMap[headingColor]}>
        {Icon && (
          <Icon data-h2-height="base(auto)" data-h2-width="base(x.85)" />
        )}
        {title}
        {link}
      </div>
      <div>{children}</div>
    </>
  );
};

export default TaskCard;
