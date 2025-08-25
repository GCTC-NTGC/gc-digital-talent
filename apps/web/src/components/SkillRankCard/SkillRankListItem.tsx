import { useIntl } from "react-intl";
import { Fragment, ReactNode } from "react";
import { tv } from "tailwind-variants";

import { Link } from "@gc-digital-talent/ui";
import { commonMessages, getSkillLevelName } from "@gc-digital-talent/i18n";
import {
  FragmentType,
  getFragment,
  graphql,
  Scalars,
} from "@gc-digital-talent/graphql";

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

const SkillRankListItem_Fragment = graphql(/** GraphQL */ `
  fragment SkillRankListItem on UserSkill {
    skillLevel
    skill {
      id
      name {
        localized
      }
      category {
        value
      }
    }
  }
`);

interface SkillRankListItemProps {
  query: FragmentType<typeof SkillRankListItem_Fragment>;
  editable?: boolean;
  from?: string;
}

const SkillRankListItem = ({
  query,
  editable = false,
}: SkillRankListItemProps) => {
  const intl = useIntl();
  const userSkill = getFragment(SkillRankListItem_Fragment, query);

  const NameWrapper = editable ? SkillLink : Fragment;

  return (
    <li>
      <span className="flex items-start justify-between gap-x-1.5 gap-y-3">
        <NameWrapper {...(editable && { id: userSkill.skill.id })}>
          {userSkill.skill.name.localized ??
            intl.formatMessage(commonMessages.notAvailable)}
        </NameWrapper>
        {userSkill?.skillLevel ? (
          <span className={suffix()}>
            {intl.formatMessage(
              getSkillLevelName(
                userSkill.skillLevel,
                userSkill.skill.category.value,
              ),
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
