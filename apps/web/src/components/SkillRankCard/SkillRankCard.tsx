import { useIntl } from "react-intl";
import { ReactNode } from "react";

import { Heading, HeadingLevel, Link, Separator } from "@gc-digital-talent/ui";
import { commonMessages } from "@gc-digital-talent/i18n";
import { SkillShowcase_UserSkillFragment } from "@gc-digital-talent/graphql";

import SkillRankListItem from "./SkillRankListItem";
import NullMessage, { NullMessageProps } from "./NullMessage";

interface SkillRankCardProps {
  title: ReactNode;
  description: ReactNode;
  userSkills: readonly SkillShowcase_UserSkillFragment[];
  titleAs?: HeadingLevel;
  editable?: boolean;
  editLink?: NullMessageProps["editLink"];
  type: "top" | "improve";
}

const SkillRankCard = ({
  title,
  description,
  userSkills,
  editLink,
  type,
  editable = false,
  titleAs = "h3",
}: SkillRankCardProps) => {
  const intl = useIntl();

  return (
    <div
      data-h2-width="base(100%)"
      data-h2-border-top="base(x.5 solid secondary)"
      data-h2-shadow="base(xl)"
      data-h2-radius="base(0 0 s s)"
      data-h2-padding="base(x1)"
      data-h2-background-color="base(foreground)"
    >
      <div
        data-h2-display="base(flex)"
        data-h2-align-items="base(center)"
        data-h2-justify-content="base(space-between)"
        data-h2-flex-direction="base(column) p-tablet(row)"
        data-h2-margin-bottom="base(x1)"
      >
        <Heading level={titleAs} size="h6" data-h2-margin="base(0)">
          {title}
        </Heading>
        {editable && editLink && (
          <Link
            mode="inline"
            color="primary"
            href={editLink.href}
            aria-label={editLink.label}
          >
            {intl.formatMessage(commonMessages.edit)}
          </Link>
        )}
      </div>
      <p>{description}</p>
      <Separator space="sm" />
      {userSkills.length ? (
        <ul data-h2-margin="base(0)" data-h2-padding-left="base(x.75)">
          {userSkills.map((userSkill) => (
            <SkillRankListItem
              key={userSkill.id}
              userSkill={userSkill}
              editable={editable}
            />
          ))}
        </ul>
      ) : (
        <NullMessage type={type} editLink={editLink} editable={editable} />
      )}
    </div>
  );
};

export default SkillRankCard;
