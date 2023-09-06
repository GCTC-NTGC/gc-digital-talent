import React from "react";
import { useIntl, IntlShape } from "react-intl";
import {
  ColumnDef,
  createColumnHelper,
  CellContext,
  Row,
} from "@tanstack/react-table";

import {
  Skill,
  SkillLevel,
  UserSkill,
  useCreateUserSkillMutation,
} from "@gc-digital-talent/graphql";
import { getLocalizedName } from "@gc-digital-talent/i18n";
import { Link } from "@gc-digital-talent/ui";
import {
  getBehaviouralSkillLevel,
  getTechnicalSkillLevel,
} from "@gc-digital-talent/i18n/src/messages/localizedConstants";
import { useAuthorization } from "@gc-digital-talent/auth";

import Table from "~/components/Table/ResponsiveTable/ResponsiveTable";
import useRoutes from "~/hooks/useRoutes";

import SkillDialog from "../../../components/SkillDialog/SkillDialog";

type UserSkillCell = CellContext<UserSkill, unknown>;

const columnHelper = createColumnHelper<UserSkill>();

const skillLevelSort = (a: Row<UserSkill>, b: Row<UserSkill>) => {
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

interface SkillLibraryTableProps {
  caption: string;
  data: UserSkill[];
  allSkills: Skill[];
  isTechnical?: boolean;
}

const SkillLibraryTable = ({
  caption,
  data,
  allSkills,
  isTechnical = false,
}: SkillLibraryTableProps) => {
  const intl = useIntl();
  const paths = useRoutes();
  const { user } = useAuthorization();
  const [, executeCreateMutation] = useCreateUserSkillMutation();

  const levelGetter = isTechnical
    ? getTechnicalSkillLevel
    : getBehaviouralSkillLevel;

  const columns = [
    columnHelper.accessor((row) => getLocalizedName(row.skill.name, intl), {
      id: "name",
      header: intl.formatMessage({
        defaultMessage: "Skill name",
        id: "hjxxaQ",
        description: "Skill name column header for the skill library table",
      }),
      cell: (cell: UserSkillCell) => skillNameCell(cell, intl, paths),
      enableHiding: false,
      enableColumnFilter: false,
      meta: {
        isRowTitle: true,
      },
    }),
    columnHelper.accessor((row) => row.experiences?.length || 0, {
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
              "{count, plural, =0 {0 experiences} =1 {1 experience} other {# experiences}}",
            id: "/ldR5A",
            description: "Number of experiences linked to a skill",
          },
          {
            count: cell.row.original.experiences?.length || 0,
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
          original: { skillLevel },
        },
      }: UserSkillCell) =>
        skillLevel ? intl.formatMessage(levelGetter(skillLevel)) : null,
      enableHiding: false,
      enableColumnFilter: false,
      sortingFn: skillLevelSort,
    }),
  ] as ColumnDef<UserSkill>[];

  return (
    <Table
      caption={caption}
      data={data}
      columns={columns}
      add={{
        component: (
          <SkillDialog
            context="library"
            showCategory={false}
            skills={allSkills}
            onSave={async (value) => {
              executeCreateMutation({
                userId: user?.id,
                skillId: value?.skill,
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
          defaultMessage: "Search for a skill",
          id: "RjYGPw",
          description: "Label for the skill library table search input",
        }),
        internal: true,
      }}
      sort={{
        internal: true,
      }}
      pagination={{
        internal: true,
        total: data.length,
        pageSizes: [10, 20, 50],
      }}
    />
  );
};

export default SkillLibraryTable;
