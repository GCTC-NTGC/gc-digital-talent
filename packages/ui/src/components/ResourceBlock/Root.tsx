import { ReactElement, ReactNode, useId } from "react";

import Heading, { HeadingLevel } from "../Heading";
import { BaseItemProps } from "./BaseItem";

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
    "data-h2-border-bottom-color": "base(primary.darkest)",
  },
  secondary: {
    "data-h2-background-color": "base(secondary.lightest)",
    "data-h2-border-bottom-color": "base(secondary.darkest)",
  },
  tertiary: {
    "data-h2-background-color": "base(tertiary.lightest)",
    "data-h2-border-bottom-color": "base(tertiary.darkest)",
  },
  quaternary: {
    "data-h2-background-color": "base(quaternary.lightest)",
    "data-h2-border-bottom-color": "base(quaternary.darkest)",
  },
  quinary: {
    "data-h2-background-color": "base(quinary.lightest)",
    "data-h2-border-bottom-color": "base(quinary.darkest)",
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

type MaybeElement = ReactElement<BaseItemProps> | null;

export interface RootProps {
  title: ReactNode;
  headingColor?: CardColor;
  headingAs?: HeadingLevel;
  children: MaybeElement | MaybeElement[]; // Restricts children to only expected items;
}

const Root = ({
  title,
  headingColor = "primary",
  headingAs = "h3",
  children,
}: RootProps) => {
  const headingId = useId();
  return (
    <nav
      data-h2-shadow="base(larger)"
      data-h2-border-radius="base(rounded)"
      data-h2-background-color="base(foreground)"
      aria-labelledby={headingId}
    >
      {/* heading bar */}
      <div
        {...headingBarStyleMap[headingColor]}
        data-h2-border-radius="base(rounded rounded 0 0)"
        data-h2-border-bottom="base(1px solid)"
        data-h2-padding="base(x1) l-tablet(x1 x1.5)"
        data-h2-text-align="base(center)"
      >
        {/* wrapper */}
        <div {...wrapperStyleMap[headingColor]}>
          <Heading
            level={headingAs}
            size="h4"
            data-h2-margin="base(0)"
            data-h2-text-align="base(center)"
            id={headingId}
          >
            {title}
          </Heading>
        </div>
      </div>
      {/* content */}
      <div
        data-h2-display="base(flex)"
        data-h2-flex-direction="base(column)"
        role="list"
      >
        {children}
      </div>
    </nav>
  );
};

export default Root;
