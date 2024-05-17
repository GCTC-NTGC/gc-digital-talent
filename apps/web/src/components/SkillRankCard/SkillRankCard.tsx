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
      className="w-full rounded-b p-6 shadow-xl"
      data-h2-border-top="base(x.5 solid secondary)"
      data-h2-background-color="base(foreground)"
    >
      <div className="space-between mb-6 flex flex-col items-center sm:flex-row">
        <Heading level={titleAs} size="h6" data-h2-margin="base(0)">
          {title}
        </Heading>
        {editable && editLink && (
          <Link
            mode="inline"
            color="secondary"
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
        <ul className="list-outside list-disc pl-4.5">
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
