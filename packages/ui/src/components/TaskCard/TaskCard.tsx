import { cloneElement, ReactElement, ReactNode } from "react";

import { IconType } from "../../types";
import { LinkProps } from "../Link";
import { HeadingLevel } from "../Heading";
import { headingStyles as headingComponentStyles } from "../Heading/styles";

export const colorOptions = [
  "primary",
  "secondary",
  "tertiary",
  "quaternary",
  "quinary",
] as const;

type CardColor = (typeof colorOptions)[number];

const headingBarStyleMap: Record<CardColor, Record<string, string>> = {
  primary: {
    "data-h2-background-color": "base(primary.lightest)",
    "data-h2-border-bottom": "base(primary.darkest)",
  },
  secondary: {
    "data-h2-background-color": "base(secondary.lightest)",
    "data-h2-border-bottom": "base(secondary.darkest)",
  },
  tertiary: {
    "data-h2-background-color": "base(tertiary.lightest)",
    "data-h2-border-bottom": "base(tertiary.darkest)",
  },
  quaternary: {
    "data-h2-background-color": "base(quaternary.lightest)",
    "data-h2-border-bottom": "base(quaternary.darkest)",
  },
  quinary: {
    "data-h2-background-color": "base(quinary.lightest)",
    "data-h2-border-bottom": "base(quinary.darkest)",
  },
};

const wrapperStyleMap: Record<CardColor, Record<string, string>> = {
  primary: {
    "data-h2-color": "base(primary.darkest)",
  },
  secondary: {
    "data-h2-color": "base(secondary.darkest)",
  },
  tertiary: {
    "data-h2-color": "base(tertiary.darkest)",
  },
  quaternary: {
    "data-h2-color": "base(quaternary.darkest)",
  },
  quinary: {
    "data-h2-color": "base(quinary.darkest)",
  },
};

export interface TaskCardProps {
  icon?: IconType;
  title: ReactNode;
  headingColor?: CardColor;
  link?: ReactElement<LinkProps>;
  headingAs?: HeadingLevel;
  children?: ReactNode;
}

const TaskCard = ({
  icon,
  title,
  headingColor = "primary",
  link: rawLink,
  headingAs = "h3",
  children,
}: TaskCardProps) => {
  // prepare link
  const headingBarLink = rawLink
    ? cloneElement(rawLink, {
        color: headingColor,
      })
    : null;

  // prepare icon element
  const Icon = icon;

  // prepare heading text element
  const HeadingTextElement = headingAs;
  const headingTextStyles = { ...headingComponentStyles["h4"] };
  delete headingTextStyles["data-h2-margin"];
  return (
    <div
      data-h2-shadow="base(larger)"
      data-h2-border-radius="base(rounded)"
      data-h2-background-color="base(foreground)"
    >
      {/* heading bar */}
      <div
        {...headingBarStyleMap[headingColor]}
        data-h2-border-radius="base(rounded rounded 0 0)"
        data-h2-border-bottom-width="base(1px)"
        data-h2-border-bottom-style="base(solid)"
        data-h2-padding="base(x1 x1.5 x1 x1.5)"
        data-h2-display="base(flex)"
        data-h2-flex-direction="base(column) p-tablet(row)"
        data-h2-gap="base(x0.25) p-tablet(x2)"
        data-h2-align-items="base(center)"
      >
        {/* wrapper */}
        <div
          {...wrapperStyleMap[headingColor]}
          data-h2-flex-grow="base(2)"
          data-h2-display="base(flex)"
          data-h2-gap="base(x0.5)"
          data-h2-align-items="base(center)"
        >
          {Icon ? (
            <Icon
              data-h2-display="base(none) p-tablet(unset)"
              data-h2-height="base(x1)"
              data-h2-width="base(auto)"
            />
          ) : null}
          <HeadingTextElement {...headingTextStyles}>
            {title}
          </HeadingTextElement>
        </div>
        {headingBarLink}
      </div>
      {/* content */}
      <div>{children}</div>
    </div>
  );
};

export default TaskCard;
