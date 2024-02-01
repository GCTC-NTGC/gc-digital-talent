import React from "react";
import { useIntl } from "react-intl";

import { Link } from "@gc-digital-talent/ui";
import {
  commonMessages,
  getBehaviouralSkillLevel,
  getLocalizedName,
  getTechnicalSkillLevel,
} from "@gc-digital-talent/i18n";

import { Scalars, SkillCategory, UserSkill } from "~/api/generated";
import useRoutes from "~/hooks/useRoutes";

interface SkillLinkProps {
  id?: Scalars["ID"];
  children: React.ReactNode;
}

const SkillLink = ({ id, children }: SkillLinkProps) => {
  const paths = useRoutes();
  const searchParams = new URLSearchParams();
  searchParams.set("from", "showcase");

  return (
    <Link
      href={`${paths.editUserSkill(id ?? "")}?${searchParams.toString()}`}
      mode="text"
      color="black"
      data-h2-text-align="base(left)"
    >
      {children}
    </Link>
  );
};

interface SkillRankListItemProps {
  userSkill: UserSkill;
  editable?: boolean;
  from?: string;
}

const SkillRankListItem = ({
  userSkill: { skill, skillLevel },
  editable = false,
}: SkillRankListItemProps) => {
  const intl = useIntl();

  const levelGetter =
    skill.category === SkillCategory.Technical
      ? getTechnicalSkillLevel
      : getBehaviouralSkillLevel;

  const NameWrapper = editable ? SkillLink : React.Fragment;

  return (
    <li data-h2-margin-bottom="base(x.25)">
      <span
        data-h2-display="base(flex)"
        data-h2-align-items="base(flex-start)"
        data-h2-gap="base(x.5 x.25)"
        data-h2-justify-content="base(space-between)"
      >
        <NameWrapper {...(editable && { id: skill.id })}>
          {getLocalizedName(skill.name, intl)}
        </NameWrapper>
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

export default SkillRankListItem;
