import { ReactElement, ReactNode } from "react";
import CheckCircleIcon from "@heroicons/react/20/solid/CheckCircleIcon";
import ExclamationCircleIcon from "@heroicons/react/20/solid/ExclamationCircleIcon";
import ArrowSmallRightIcon from "@heroicons/react/20/solid/ArrowSmallRightIcon";

import Heading, { HeadingLevel } from "../Heading";
import Link, { LinkProps } from "../Link";
import { HydrogenAttributes } from "../../types";

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

interface RootProps {
  title: ReactNode;
  headingColor?: CardColor;
  headingAs?: HeadingLevel;
  children: ReactElement<ItemProps> | Array<ReactElement<ItemProps>>; // Restricts children to only expected items;
}

const Root = ({
  title,
  headingColor = "primary",
  headingAs = "h3",
  children,
}: RootProps) => {
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
        data-h2-border-bottom="base(1px solid)"
        data-h2-padding="base(x1) p-tablet(x1 x1.5)"
        data-h2-text-align="base(center)"
      >
        {/* wrapper */}
        <div {...wrapperStyleMap[headingColor]}>
          <Heading
            level={headingAs}
            size="h4"
            data-h2-margin="base(0)"
            data-h2-text-align="base(center)"
          >
            {title}
          </Heading>
        </div>
      </div>
      {/* content */}
      <div data-h2-display="base(flex)" data-h2-flex-direction="base(column)">
        {children}
      </div>
    </div>
  );
};

// an icon pinned to the top-right to show the completion state
const StateIcon = ({ state }: { state: ItemProps["state"] }) => {
  const commonStyles: HydrogenAttributes = {
    "data-h2-width": "base(20px)",
    "data-h2-height": "base(20px)",
    "data-h2-position": "base(absolute)",
    "data-h2-location": "base(x0.75, x0.75, auto, auto)",
  };

  if (state === "incomplete") {
    return (
      <ExclamationCircleIcon data-h2-color="base(error)" {...commonStyles} />
    );
  }
  if (state === "complete") {
    return <CheckCircleIcon data-h2-color="base(success)" {...commonStyles} />;
  }
  return null;
};

interface ItemProps {
  title: string;
  href: LinkProps["href"];
  description: string;
  state?: "incomplete" | "complete";
}

const Item = ({ title, href, description, state }: ItemProps) => {
  const extraStateStyles =
    state === "incomplete"
      ? {
          // should match the absolute positioning of the state icon ( + half the height & width to get the center)
          "data-h2-background":
            "base(radial-gradient(circle x5 at top calc(x0.75 + 10px) right calc(x0.75 + 10px), error.10, foreground))",
        }
      : {};

  return (
    <div
      data-h2-background="base(foreground)"
      data-h2-padding="base(x1) p-tablet(x1 x1.5)"
      data-h2-display="base(flex)"
      data-h2-flex-direction="base(column)"
      data-h2-gap="base(x0.15)"
      data-h2-border-bottom="base:selectors[:not(:last-child)](1px solid gray.lighter)"
      // make the containing block for state icon
      data-h2-position="base(relative)"
      {...extraStateStyles}
    >
      <StateIcon state={state} />
      <div
        data-h2-display="base(flex)"
        data-h2-gap="base(x0.15)"
        data-h2-align-items="base(center)"
      >
        <Link
          href={href}
          color="black"
          // yuck, style exception 😞
          data-h2-font-weight="base(bold)"
          // big click target black magic 🧙
          data-h2-position="base:selectors[::after](absolute)"
          data-h2-content="base:selectors[::after](' ')"
          data-h2-inset="base:selectors[::after](0)"
          data-h2-justify-self="base(end)"
        >
          {title}
        </Link>
        <ArrowSmallRightIcon
          data-h2-width="base(x0.75)"
          data-h2-height="base(x0.75)"
          data-h2-color="base(black.light)"
          aria-hidden
        />
      </div>
      <p data-h2-color="base(black.light)">{description}</p>
    </div>
  );
};

const ResourceBlock = {
  Root,
  Item,
};

export default ResourceBlock;
