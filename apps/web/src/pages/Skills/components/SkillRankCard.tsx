import React from "react";
import { useIntl } from "react-intl";

import { SkillCategory, UserSkill } from "@gc-digital-talent/graphql";
import {
  Heading,
  HeadingLevel,
  Link,
  Separator,
  Well,
} from "@gc-digital-talent/ui";
import { commonMessages, getLocalizedName } from "@gc-digital-talent/i18n";
import {
  getBehaviouralSkillLevel,
  getTechnicalSkillLevel,
} from "@gc-digital-talent/i18n/src/messages/localizedConstants";

import useRoutes from "~/hooks/useRoutes";

interface SkillRankListItemProps {
  userSkill: UserSkill;
}

const SkillRankListItem = ({
  userSkill: { skill, skillLevel },
}: SkillRankListItemProps) => {
  const intl = useIntl();
  const paths = useRoutes();

  const levelGetter =
    skill.category === SkillCategory.Technical
      ? getTechnicalSkillLevel
      : getBehaviouralSkillLevel;

  return (
    <li data-h2-margin-bottom="base(x.25)">
      <span
        data-h2-display="base(flex)"
        data-h2-align-items="base(flex-start)"
        data-h2-gap="base(x.5 x.25)"
        data-h2-justify-content="base(space-between)"
      >
        <Link
          href={paths.editUserSkill(skill.id)}
          mode="text"
          color="black"
          data-h2-text-align="base(left)"
        >
          {getLocalizedName(skill.name, intl)}
        </Link>
        {skillLevel ? (
          <span
            data-h2-font-size="base(caption, calc(var(--h2-line-height-body) + .4))"
            data-h2-color="base(black.light)"
            data-h2-flex-shrink="base(0)"
          >
            {intl.formatMessage(levelGetter(skillLevel))}
          </span>
        ) : (
          <span
            data-h2-font-size="base(caption, calc(var(--h2-line-height-body) + .4))"
            data-h2-color="base(black.light)"
            data-h2-flex-shrink="base(0)"
          >
            {intl.formatMessage(commonMessages.unspecified)}
          </span>
        )}
      </span>
    </li>
  );
};

interface SkillRankCardProps {
  title: React.ReactNode;
  description: React.ReactNode;
  userSkills: UserSkill[];
  titleAs?: HeadingLevel;
  editLink: {
    label: string;
    href: string;
  };
}

const SkillRankCard = ({
  title,
  description,
  userSkills,
  editLink,
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
        <Link
          mode="inline"
          color="secondary"
          href={editLink.href}
          aria-label={editLink.label}
        >
          {intl.formatMessage({
            defaultMessage: "Edit",
            id: "igcM7/",
            description: "Link text for editing a list of skill rankings",
          })}
        </Link>
      </div>
      <p>{description}</p>
      <Separator
        orientation="horizontal"
        data-h2-background-color="base(gray.lighter)"
        data-h2-margin="base(x1 0)"
      />
      {userSkills.length ? (
        <ul data-h2-margin="base(0)" data-h2-padding-left="base(x.75)">
          {userSkills.map((userSkill) => (
            <SkillRankListItem key={userSkill.id} userSkill={userSkill} />
          ))}
        </ul>
      ) : (
        <Well data-h2-text-align="base(center)">
          <Link
            mode="inline"
            color="black"
            block
            href={editLink.href}
            aria-label={editLink.label}
          >
            {intl.formatMessage({
              defaultMessage: "Add some skills to this list.",
              id: "dnKWUf",
              description:
                "Text displayed when no skills have been added to a ranking",
            })}
          </Link>
        </Well>
      )}
    </div>
  );
};

export default SkillRankCard;
