import * as React from "react";

import {
  ExclamationCircleIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/solid";

import { Link } from "@gc-digital-talent/ui";
import { useIntl } from "react-intl";

export type TextColor = "default" | "error" | "success";
const textColorMap: Record<TextColor, Record<string, string>> = {
  default: {
    "data-h2-color": "base:all(black)",
  },
  error: {
    "data-h2-color": "base:all(error.darker)",
  },
  success: {
    "data-h2-color": "base:all(success)",
  },
};

export type IconColor = "default" | "error" | "success" | "tertiary.dark";
const iconColorMap: Record<IconColor, Record<string, string>> = {
  default: {
    color: "rgba(var(--h2-color-black), 1)",
  },
  error: {
    color: "rgba(var(--h2-color-error), 1)",
  },
  success: {
    color: "rgba(var(--h2-color-success), 1)",
  },
  "tertiary.dark": {
    color: "rgba(var(--h2-color-tertiary-dark), 1)",
  },
};

export interface HeroCardItemProps {
  line: string;
  lineColor?: TextColor;
  subLine?: string;
  subLineColor?: TextColor;
  icon?: React.FC<React.SVGProps<SVGSVGElement>>;
  iconColor?: IconColor;
  href?: string;
}

export const HeroCardItem = ({
  line,
  lineColor = "default",
  subLine,
  subLineColor = "default",
  icon,
  iconColor = "success",
  href,
}: HeroCardItemProps) => {
  const Icon = icon || ExclamationCircleIcon;
  return (
    <li
      data-h2-display="base(flex)"
      data-h2-flex-direction="base(row)"
      data-h2-gap="base(x0.5)"
      data-h2-margin-bottom="base(x0.25)"
    >
      <Icon
        style={{
          width: "1.5em",
          height: "1.5em",
          ...iconColorMap[iconColor],
        }}
      />

      <div>
        {href ? (
          <Link href={href} {...{ ...textColorMap[lineColor] }}>
            {line}
          </Link>
        ) : (
          <p {...{ ...textColorMap[lineColor] }}>{line}</p>
        )}
        <p
          data-h2-font-size="base(caption)"
          {...{ ...textColorMap[subLineColor] }}
        >
          {subLine}
        </p>
      </div>
    </li>
  );
};

export type ProfileItemStatus =
  | "has-empty-required-fields"
  | "has-empty-optional-fields"
  | "all-sections-complete";

export interface HeroCardProfileItemProps {
  sectionName: string;
  href: string;
  status: ProfileItemStatus;
}

export const HeroCardProfileItem = ({
  sectionName,
  href,
  status,
}: HeroCardProfileItemProps) => {
  const intl = useIntl();
  switch (status) {
    case "has-empty-required-fields":
      return (
        <HeroCardItem
          icon={ExclamationCircleIcon}
          iconColor="error"
          line={sectionName}
          lineColor="error"
          subLine={intl.formatMessage({
            defaultMessage: "Required sections missing",
            id: "JMe3n2",
            description:
              "Context message that some required sections are missing",
          })}
          subLineColor="error"
          href={href}
        />
      );
    case "has-empty-optional-fields":
      return (
        <HeroCardItem
          icon={CheckCircleIcon}
          line={sectionName}
          subLine={intl.formatMessage({
            defaultMessage: "Optional sections available",
            id: "bHIq0J",
            description:
              "Context message that some optional sections are available",
          })}
          href={href}
        />
      );
    case "all-sections-complete":
      return (
        <HeroCardItem
          icon={CheckCircleIcon}
          line={sectionName}
          subLine={intl.formatMessage({
            defaultMessage: "All sections complete",
            id: "dd/lhx",
            description: "Context message that all sections are complete",
          })}
          subLineColor="success"
          href={href}
        />
      );
    default:
      return <HeroCardItem line={sectionName} />;
  }
};

export interface HeroCardExperienceItemProps {
  sectionName: string;
  itemCount?: number;
  icon?: React.FC<React.SVGProps<SVGSVGElement>>;
}

export const HeroCardExperienceItem = ({
  sectionName,
  itemCount = 0,
  icon,
}: HeroCardExperienceItemProps) => {
  const intl = useIntl();
  return (
    <HeroCardItem
      icon={icon}
      iconColor="tertiary.dark"
      line={sectionName}
      subLine={intl.formatMessage(
        {
          defaultMessage: `{itemCount, plural,
          =0 {0 items added}
          =1 {1 item added}
          other {# items added}
        }`,
          id: "aRTIWM",
          description:
            "context message to describe number of experience items added",
        },
        { itemCount },
      )}
    />
  );
};
