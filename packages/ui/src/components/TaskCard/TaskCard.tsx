import { ReactElement, ReactNode } from "react";

import { IconType } from "../../types";
import Link, { LinkProps } from "../Link";
import { HeadingLevel } from "../Heading";

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

interface ItemProps {
  children?: ReactNode;
}

const Item = ({ children }: ItemProps) => {
  return (
    <div
      data-h2-padding="base(x1) p-tablet(x1 x1.5)"
      data-h2-border-bottom="base:selectors[:not(:last-child)](1px solid gray.lighter)"
    >
      {children}
    </div>
  );
};

interface TaskCardHeadingProps {
  icon?: IconType;
  headingAs?: HeadingLevel;
  children?: ReactNode;
}

// a custom heading that is somewhat different from our standard heading component
const TaskCardHeading = ({
  icon,
  headingAs = "h3",
  children,
}: TaskCardHeadingProps) => {
  const Icon = icon;
  const CustomHeading = headingAs;
  return (
    <CustomHeading
      data-h2-font-size="base(h4)"
      data-h2-font-weight="base(400)"
      data-h2-margin="base(0)" // remove from imported styles
      {...(Icon && {
        // icon only appears greater than p-tablet width
        "data-h2-display": "p-tablet(flex)",
        "data-h2-align-items": "p-tablet(start)",
        "data-h2-gap": "p-tablet(0 x.5)",
      })}
    >
      {Icon ? (
        <Icon
          data-h2-height="base(x1.15)"
          data-h2-width="base(x1.15)"
          data-h2-stroke-width="base:children[path](1.6)"
          data-h2-display="base(none) p-tablet(inline-block)"
          data-h2-flex-shrink="p-tablet(0)"
        />
      ) : null}
      <div
        data-h2-text-align="base(center) p-tablet(left)"
        data-h2-text-wrap="base(balance)"
      >
        {children}
      </div>
    </CustomHeading>
  );
};

interface RootProps {
  icon?: IconType;
  title: ReactNode;
  headingColor?: CardColor;
  link?: {
    label: string;
    href: LinkProps["href"];
  };
  headingAs?: HeadingLevel;
  children?: ReactElement<ItemProps> | ReactElement<ItemProps>[]; // Restricts children to only expected items;
}

const Root = ({
  icon,
  title,
  headingColor = "primary",
  link,
  headingAs,
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
        data-h2-display="base(flex)"
        data-h2-flex-direction="base(column) p-tablet(row)"
        data-h2-gap="base(x1) p-tablet(x2)"
        data-h2-align-items="base(center)"
      >
        {/* wrapper */}
        <div {...wrapperStyleMap[headingColor]} data-h2-flex-grow="base(2)">
          <TaskCardHeading icon={icon} headingAs={headingAs}>
            {title}
          </TaskCardHeading>
        </div>
        {link ? (
          <Link
            color={headingColor}
            href={link.href}
            data-h2-white-space="base(nowrap)"
          >
            {link.label}
          </Link>
        ) : null}
      </div>
      {/* content */}
      <div>{children}</div>
    </div>
  );
};

const TaskCard = {
  Root,
  Item,
};

export default TaskCard;
