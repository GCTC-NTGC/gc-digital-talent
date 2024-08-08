import { ReactNode } from "react";

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

export interface ResourceBlockProps {
  title: ReactNode;
  headingColor?: CardColor;
  headingAs?: HeadingLevel;
  children?: ReactNode;
}

const ResourceBlock = ({
  title,
  headingColor = "primary",
  headingAs = "h3",
  children,
}: ResourceBlockProps) => {
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
        data-h2-text-align="base(center)"
      >
        {/* wrapper */}
        <div {...wrapperStyleMap[headingColor]}>
          <HeadingTextElement {...headingTextStyles}>
            {title}
          </HeadingTextElement>
        </div>
      </div>
      {/* content */}
      <div>{children}</div>
    </div>
  );
};

export default ResourceBlock;
