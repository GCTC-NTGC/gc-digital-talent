import { useIntl, IntlShape } from "react-intl";
import {
  ColumnDef,
  createColumnHelper,
  CellContext,
  Row,
} from "@tanstack/react-table";
import { useMutation } from "urql";

import { getLocalizedName, getSkillLevelName } from "@gc-digital-talent/i18n";
import { Link } from "@gc-digital-talent/ui";
import { useAuthorization } from "@gc-digital-talent/auth";
import {
  FragmentType,
  getFragment,
  graphql,
  SkillCategory,
  SkillLevel,
  SkillPortfolioTable_UserSkillFragment as SkillPortfolioTableUserSkillFragmentType,
} from "@gc-digital-talent/graphql";

import Table from "~/components/Table/ResponsiveTable/ResponsiveTable";
import { normalizedText } from "~/components/Table/sortingFns";
import useRoutes from "~/hooks/useRoutes";
import SkillBrowserDialog from "~/components/SkillBrowser/SkillBrowserDialog";

import { CreateUserSkill_Mutation } from "../operations";

export const SkillPortfolioTable_UserSkillFragment = graphql(/* GraphQL */ `
  fragment SkillPortfolioTable_UserSkill on UserSkill {
    id
    whenSkillUsed
    skillLevel
    topSkillsRank
    improveSkillsRank
    experiences {
      id
    }
    skill {
      id
      name {
        en
        fr
      }
      category {
        value
        label {
          en
          fr
        }
      }
    }
  }
`);

export const SkillPortfolioTable_SkillFragment = graphql(/* GraphQL */ `
  fragment SkillPortfolioTable_Skill on Skill {
    id
    key
    category {
      value
      label {
        en
        fr
      }
    }
    name {
      en
      fr
    }
    description {
      en
      fr
    }
    keywords {
      en
      fr
    }
    families {
      id
      key
      name {
        en
        fr
      }
      description {
        en
        fr
      }
    }
  }
`);

type UserSkillCell = CellContext<
  SkillPortfolioTableUserSkillFragmentType,
  unknown
>;

const columnHelper =
  createColumnHelper<SkillPortfolioTableUserSkillFragmentType>();

const skillLevelSort = (
  a: Row<SkillPortfolioTableUserSkillFragmentType>,
  b: Row<SkillPortfolioTableUserSkillFragmentType>,
) => {
  const order = [
    SkillLevel.Beginner,
    SkillLevel.Intermediate,
    SkillLevel.Advanced,
    SkillLevel.Lead,
  ];

  if (!a.original.skillLevel) {
    return -1;
  }

  if (!b.original.skillLevel) {
    return 1;
  }

  return (
    order.indexOf(a.original.skillLevel) - order.indexOf(b.original.skillLevel)
  );
};

const skillNameCell = (
  cell: UserSkillCell,
  intl: IntlShape,
  paths: ReturnType<typeof useRoutes>,
) => (
  <Link href={paths.editUserSkill(cell.row.original.skill.id)}>
    {getLocalizedName(cell.row.original.skill.name, intl)}
  </Link>
);

interface SkillPortfolioTableProps {
  caption: string;
  userSkillsQuery: FragmentType<typeof SkillPortfolioTable_UserSkillFragment>[];
  allSkillsQuery: FragmentType<typeof SkillPortfolioTable_SkillFragment>[];
}

const SkillPortfolioTable = ({
  caption,
  userSkillsQuery,
  allSkillsQuery,
}: SkillPortfolioTableProps) => {
  const intl = useIntl();
  const paths = useRoutes();
  const { userAuthInfo } = useAuthorization();
  const [, executeCreateMutation] = useMutation(CreateUserSkill_Mutation);

  const userSkills = getFragment(
    SkillPortfolioTable_UserSkillFragment,
    userSkillsQuery,
  );
  const allSkills = getFragment(
    SkillPortfolioTable_SkillFragment,
    allSkillsQuery,
  );

  const userSkillSkillIds = userSkills.map((usrSkill) => usrSkill.skill.id);
  const unclaimedSkills = allSkills.filter(
    (skill) => !userSkillSkillIds.includes(skill.id),
  );

  const columns = [
    columnHelper.accessor((row) => getLocalizedName(row.skill.name, intl), {
      id: "name",
      header: intl.formatMessage({
        defaultMessage: "Skill name",
        id: "hjxxaQ",
        description: "Skill name column header for the skill library table",
      }),
      sortingFn: normalizedText,
      cell: (cell: UserSkillCell) => skillNameCell(cell, intl, paths),
      enableHiding: false,
      enableColumnFilter: false,
      meta: {
        isRowTitle: true,
      },
    }),
    columnHelper.accessor((row) => row.experiences?.length ?? 0, {
      id: "experiences",
      header: intl.formatMessage({
        defaultMessage: "Career experience",
        id: "uWdGeZ",
        description:
          "Experience count column header for the skill library table",
      }),
      cell: (cell: UserSkillCell) =>
        intl.formatMessage(
          {
            defaultMessage:
              "{count, plural, =0 {0 experiences} one {# experience} other {# experiences}}",
            id: "0NKan4",
            description: "Number of experiences linked to a skill",
          },
          {
            count: cell.row.original.experiences?.length ?? 0,
          },
        ),
      enableHiding: false,
      enableColumnFilter: false,
    }),
    columnHelper.accessor((row) => row.skillLevel, {
      id: "skillLevel",
      header: intl.formatMessage({
        defaultMessage: "Skill level",
        id: "00tmhW",
        description: "Skill level column header for the skill library table",
      }),
      cell: ({
        row: {
          original: {
            skillLevel,
            skill: { category },
          },
        },
      }: UserSkillCell) =>
        skillLevel
          ? intl.formatMessage(
              getSkillLevelName(
                skillLevel,
                category.value ?? SkillCategory.Technical,
              ),
            )
          : null,
      enableHiding: false,
      enableColumnFilter: false,
      sortingFn: skillLevelSort,
    }),
  ] as ColumnDef<SkillPortfolioTableUserSkillFragmentType>[];

  return (
    <Table<SkillPortfolioTableUserSkillFragmentType>
      caption={caption}
      data={userSkills}
      columns={columns}
      urlSync={false}
      add={{
        component: (
          <SkillBrowserDialog
            context="library"
            skills={unclaimedSkills}
            onSave={async (value) => {
              await executeCreateMutation({
                userId: userAuthInfo?.id ?? "",
                skillId: value?.skill ?? "",
                userSkill: {
                  skillLevel: value.skillLevel,
                  whenSkillUsed: value.whenSkillUsed,
                },
              });
            }}
          />
        ),
      }}
      search={{
        label: intl.formatMessage({
          defaultMessage: "Search your skills",
          id: "bBIZ3a",
          description: "Label for the skill library table search input",
        }),
        internal: true,
      }}
      sort={{
        internal: true,
      }}
      pagination={{
        internal: true,
        total: userSkills.length,
        pageSizes: [10, 20, 50],
      }}
      nullMessage={{
        title: intl.formatMessage({
          defaultMessage: "There aren't any skills here yet.",
          id: "X5tRR4",
          description: "Title for no skills in a users library",
        }),
        description: intl.formatMessage({
          defaultMessage:
            'Get started by adding an item using the "Add a new skill" button provided.',
          id: "FshBb0",
          description:
            "Message displayed when a user has no skills in their library",
        }),
      }}
      nullSearchMessage={{
        title: intl.formatMessage({
          defaultMessage: "There are no matching results.",
          id: "MUxI+G",
          description: "Title for when no skills match a users filters.",
        }),
        description: intl.formatMessage({
          defaultMessage:
            'Try using a different term or searching for the skill using the "Add a new skill" button provided.',
          id: "TN9ndX",
          description: "Message displayed when no skills match a users filters",
        }),
      }}
    />
  );
};

export default SkillPortfolioTable;
