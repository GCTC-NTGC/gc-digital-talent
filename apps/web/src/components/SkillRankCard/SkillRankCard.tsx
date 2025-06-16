import { useIntl } from "react-intl";
import { ReactNode } from "react";

import {
  Card,
  Heading,
  HeadingLevel,
  Link,
  Separator,
  Ul,
} from "@gc-digital-talent/ui";
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
    <Card className="w-full rounded-t-none border-t-12 border-primary">
      <div className="mb-7 flex flex-col items-center justify-between xs:flex-row">
        <Heading level={titleAs} size="h6" className="mt-0">
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
        <Ul noIndent>
          {userSkills.map((userSkill) => (
            <SkillRankListItem
              key={userSkill.id}
              userSkill={userSkill}
              editable={editable}
            />
          ))}
        </Ul>
      ) : (
        <NullMessage type={type} editLink={editLink} editable={editable} />
      )}
    </Card>
  );
};

export default SkillRankCard;
