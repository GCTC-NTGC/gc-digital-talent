import { useIntl } from "react-intl";
import { Fragment, ReactNode } from "react";
import { tv } from "tailwind-variants";

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
      className="text-left"
    >
      {children}
    </Link>
  );
};

const suffix = tv({
  base: "shrink-0 text-sm/loose text-gray-600 dark:text-gray-200",
});

interface SkillRankListItemProps {
  userSkill: Pick<UserSkill, "skill" | "skillLevel">;
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
    <li>
      <span className="flex items-start justify-between gap-x-1.5 gap-y-3">
        <NameWrapper {...(editable && { id: skill.id })}>
          {getLocalizedName(skill.name, intl)}
        </NameWrapper>
        {skillLevel ? (
          <span className={suffix()}>
            {intl.formatMessage(
              getSkillLevelName(skillLevel, skill.category.value),
            )}
          </span>
        ) : (
          <span className={suffix()}>
            {intl.formatMessage(commonMessages.unspecified)}
          </span>
        )}
      </span>
    </li>
  );
};

export default SkillRankListItem;
