import { useIntl } from "react-intl";
import type { ReactNode } from "react";

import type { HeadingLevel } from "@gc-digital-talent/ui";
import { Card, Heading, Link, Separator, Ul } from "@gc-digital-talent/ui";
import { commonMessages } from "@gc-digital-talent/i18n";
import type { FragmentType } from "@gc-digital-talent/graphql";
import { getFragment, graphql } from "@gc-digital-talent/graphql";

import SkillRankListItem from "./SkillRankListItem";
import type { NullMessageProps } from "./NullMessage";
import NullMessage from "./NullMessage";

const SkillRankCard_Fragment = graphql(/** GraphQL */ `
  fragment SkillRankCard on UserSkill {
    id
    ...SkillRankListItem
  }
`);

interface SkillRankCardProps {
  title: ReactNode;
  description?: ReactNode;
  query: FragmentType<typeof SkillRankCard_Fragment>[];
  titleAs?: HeadingLevel;
  editable?: boolean;
  editLink?: NullMessageProps["editLink"];
  type: "top" | "improve";
}

const SkillRankCard = ({
  title,
  description,
  query,
  editLink,
  type,
  editable = false,
  titleAs = "h3",
}: SkillRankCardProps) => {
  const intl = useIntl();
  const userSkills = getFragment(SkillRankCard_Fragment, query);

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
      {description && <p>{description}</p>}
      <Separator space="sm" />
      {userSkills.length ? (
        <Ul noIndent>
          {userSkills.map((userSkill) => (
            <SkillRankListItem
              key={userSkill.id}
              query={userSkill}
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
