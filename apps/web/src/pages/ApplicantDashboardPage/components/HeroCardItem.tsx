import * as React from "react";

import { useIntl } from "react-intl";
import {
  BaseInfoItemIconColor,
  BaseInfoItem,
  StatusItem,
} from "~/components/InfoItem";

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
        <StatusItem
          title={sectionName}
          subTitle={intl.formatMessage({
            defaultMessage: "Required sections missing",
            id: "JMe3n2",
            description:
              "Context message that some required sections are missing",
          })}
          status="error"
          titleHref={href}
        />
      );
    case "has-empty-optional-fields":
      return (
        <StatusItem
          title={sectionName}
          subTitle={intl.formatMessage({
            defaultMessage: "Optional sections available",
            id: "bHIq0J",
            description:
              "Context message that some optional sections are available",
          })}
          status="partial"
          titleHref={href}
        />
      );
    case "all-sections-complete":
      return (
        <StatusItem
          title={sectionName}
          subTitle={intl.formatMessage({
            defaultMessage: "All sections complete",
            id: "dd/lhx",
            description: "Context message that all sections are complete",
          })}
          status="success"
          titleHref={href}
        />
      );
    default:
      return <StatusItem title={sectionName} titleHref={href} />;
  }
};

export interface HeroCardExperienceItemProps {
  sectionName: string;
  itemCount?: number;
  icon?: React.FC<React.SVGProps<SVGSVGElement>>;
  color?: BaseInfoItemIconColor;
}

export const HeroCardExperienceItem = ({
  sectionName,
  itemCount = 0,
  icon,
  color,
}: HeroCardExperienceItemProps) => {
  const intl = useIntl();
  return (
    <BaseInfoItem
      icon={icon}
      iconColor={color}
      title={sectionName}
      subTitle={intl.formatMessage(
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
