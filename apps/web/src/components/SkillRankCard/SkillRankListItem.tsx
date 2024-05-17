import { useIntl } from "react-intl";
import { Fragment, ReactNode } from "react";

import { Link } from "@gc-digital-talent/ui";
import {
  commonMessages,
  getLocalizedName,
  getSkillLevelName,
} from "@gc-digital-talent/i18n";
import { Scalars, UserSkill } from "@gc-digital-talent/graphql";

import useRoutes from "~/hooks/useRoutes";

interface SkillLinkProps {
  id?: Scalars["ID"]["output"];
  children: ReactNode;
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

  const NameWrapper = editable ? SkillLink : Fragment;

  return (
    <li className="mb-3 w-full items-start justify-between gap-x-1.5">
      <span className="flex items-start justify-between gap-x-3 gap-y-1.5">
        <NameWrapper {...(editable && { id: skill.id })}>
          {getLocalizedName(skill.name, intl)}
        </NameWrapper>
        {skillLevel ? (
          <span
            className="shrink-0"
            data-h2-font-size="base(caption, calc(var(--h2-line-height-body) + .4))"
            data-h2-color="base(black.light)"
          >
            {intl.formatMessage(getSkillLevelName(skillLevel, skill.category))}
          </span>
        ) : (
          <span
            className="shrink-0"
            data-h2-font-size="base(caption, calc(var(--h2-line-height-body) + .4))"
            data-h2-color="base(black.light)"
          >
            {intl.formatMessage(commonMessages.unspecified)}
          </span>
        )}
      </span>
    </li>
  );
};

export default SkillRankListItem;
