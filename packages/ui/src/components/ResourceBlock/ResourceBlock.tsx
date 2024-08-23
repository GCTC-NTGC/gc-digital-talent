import { ReactElement, ReactNode, useId } from "react";
import CheckCircleIcon from "@heroicons/react/20/solid/CheckCircleIcon";
import ExclamationCircleIcon from "@heroicons/react/20/solid/ExclamationCircleIcon";
import ChevronDownIcon from "@heroicons/react/20/solid/ChevronDownIcon";
import ArrowSmallRightIcon from "@heroicons/react/20/solid/ArrowSmallRightIcon";
import { useIntl } from "react-intl";

import { commonMessages } from "@gc-digital-talent/i18n";

import Heading, { HeadingLevel } from "../Heading";
import Link, { LinkProps } from "../Link";
import { HydrogenAttributes } from "../../types";
import DropdownMenu from "../DropdownMenu";
import Button from "../Button";

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
  children: ReactElement<BaseItemProps> | Array<ReactElement<BaseItemProps>>; // Restricts children to only expected items;
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

// an icon pinned to the top-right to show the completion state
const StateIcon = ({ state }: { state: BaseItemProps["state"] }) => {
  const commonStyles: HydrogenAttributes = {
    "data-h2-width": "base(x0.75)",
    "data-h2-height": "base(x0.75)",
    "data-h2-position": "base(absolute)",
    "data-h2-location": "base(x0.75, x0.75, auto, auto)",
  };

  if (state === "incomplete") {
    return (
      <ExclamationCircleIcon
        data-h2-color="base(error) base:dark(error.lighter)"
        {...commonStyles}
      />
    );
  }
  if (state === "complete") {
    return (
      <CheckCircleIcon
        data-h2-color="base(success) base:dark(success.lighter)"
        {...commonStyles}
      />
    );
  }
  return null;
};

interface BaseItemProps {
  title: ReactNode;
  description: string;
  state?: "incomplete" | "complete";
}

const BaseItem = ({ title, description, state }: BaseItemProps) => {
  const intl = useIntl();
  const extraStateStyles =
    state === "incomplete"
      ? {
          // should match the absolute positioning of the center of the state icon (x0.75 + (x0.75/2))
          "data-h2-background":
            "base(radial-gradient(circle x5 at top x1.125 right x1.125, error.10, foreground))",
        }
      : {};

  let accessibleLabel;
  switch (state) {
    case "incomplete":
      accessibleLabel = `${title?.toString()} (${intl.formatMessage(commonMessages.incomplete)})`;
      break;
    case "complete":
      accessibleLabel = `${title?.toString()} (${intl.formatMessage(commonMessages.complete)})`;
      break;
    default:
      accessibleLabel = title?.toString() ?? undefined;
  }

  return (
    <div
      data-h2-background="base(foreground)"
      data-h2-padding="base(x1) l-tablet(x1 x1.5)"
      data-h2-display="base(flex)"
      data-h2-flex-direction="base(column)"
      data-h2-gap="base(x0.15)"
      data-h2-border-bottom="base:all:selectors[:not(:last-child)](1px solid gray.lighter)"
      data-h2-border-radius="base:all:selectors[:last-child](0 0 rounded rounded)"
      // make the containing block for state icon
      data-h2-position="base(relative)"
      aria-label={accessibleLabel}
      role="listitem"
      {...extraStateStyles}
    >
      <StateIcon state={state} />
      <div
        // icon extends margin + icons size: x0.75 + x0.75 = x1.5
        // item margin is base(x1) l-tablet(x1.5)
        data-h2-padding-right="base(x0.5) l-tablet(0)"
      >
        {title}
      </div>
      <p data-h2-color="base(black.light)" data-h2-font-size="base(caption)">
        {description}
      </p>
    </div>
  );
};

interface SingleLinkItemProps {
  title: string;
  href: LinkProps["href"];
  description: BaseItemProps["description"];
  state?: BaseItemProps["state"];
}

const SingleLinkItem = ({
  title,
  href,
  description,
  state,
}: SingleLinkItemProps) => {
  return (
    <BaseItem
      title={
        <Link
          href={href}
          color="black"
          // yuck, style exception 😞
          data-h2-font-weight="base(bold)"
        >
          {title}
          {/* issue #11284 */}
          <ArrowSmallRightIcon // eslint-disable-line deprecation/deprecation
            data-h2-width="base(auto)"
            data-h2-height="base(x0.75)"
            data-h2-color="base(black.light)"
            data-h2-margin="base(x0.15)"
            data-h2-vertical-align="base(top)"
            aria-hidden
          />
        </Link>
      }
      description={description}
      state={state}
    />
  );
};

interface LinkMenuItemProps {
  links: Array<{
    title: string;
    href: LinkProps["href"];
    isSelected?: boolean;
  }>;
  description: BaseItemProps["description"];
  state?: BaseItemProps["state"];
}

const LinkMenuItem = ({ links, description, state }: LinkMenuItemProps) => {
  const selectedLink = links.find((link) => link.isSelected) ?? links?.[0];

  const dropdown = (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <Button utilityIcon={ChevronDownIcon} mode="inline" color="black">
          {selectedLink?.title}
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content align="end" collisionPadding={2}>
        {links.map((link) => (
          <DropdownMenu.Item key={link.title + link.href} asChild color="black">
            <Link href={link.href}>{link.title}</Link>
          </DropdownMenu.Item>
        ))}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
  return <BaseItem title={dropdown} description={description} state={state} />;
};

const ResourceBlock = {
  Root,
  BaseItem,
  SingleLinkItem,
  LinkMenuItem,
};

export default ResourceBlock;
