import React from "react";
import { IntlShape, useIntl } from "react-intl";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";

import { getLocalizedName } from "@gc-digital-talent/i18n";
import { Button } from "@gc-digital-talent/ui";
import { SkillLevel } from "@gc-digital-talent/graphql";

import { Skill } from "~/api/generated";
import Table from "~/components/Table/ResponsiveTable/ResponsiveTable";
import SkillBrowserDialog from "~/components/SkillBrowser/SkillBrowserDialog";
import { normalizedText } from "~/components/Table/sortingFns";
import { NullMessageProps } from "~/components/Table/ResponsiveTable/NullMessage";

const columnHelper = createColumnHelper<
  Skill & {
    poolSkillId: string;
    requiredLevel?: SkillLevel;
  }
>();

const removeCell = (
  skill: Skill & {
    poolSkillId: string;
  },
  onClick: (id: string) => void,
  intl: IntlShape,
) => (
  <Button
    type="button"
    mode="inline"
    color="black"
    onClick={() => onClick(skill.poolSkillId)}
  >
    {intl.formatMessage(
      {
        defaultMessage: "Remove skill<hidden>, {skillName}</hidden>",
        id: "InH7pD",
        description: "Button text to remove a skill from a process",
      },
      {
        skillName: getLocalizedName(skill.name, intl),
      },
    )}
  </Button>
);

interface SkillTableProps {
  caption: string;
  data: (Skill & {
    poolSkillId: string;
    requiredLevel?: SkillLevel;
  })[];
  allSkills: Skill[];
  disableAdd?: boolean;
  nullMessage?: NullMessageProps;
  onCreate: (skillSelected: string, skillLevel: SkillLevel) => Promise<void>;
  onUpdate: (
    poolSkillSelected: string,
    skillLevel: SkillLevel,
  ) => Promise<void>;
  onRemove: (poolSkillSelected: string) => Promise<void>;
}

const SkillTable = ({
  caption,
  data,
  allSkills,
  disableAdd,
  nullMessage,
  onCreate,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onUpdate,
  onRemove,
}: SkillTableProps) => {
  const intl = useIntl();
  const availableSkills = allSkills.filter(
    (skill) => !data.find((value) => value.id === skill.id),
  );

  const handleRemove = (id: string) => {
    onRemove(id);
  };

  let columns = [
    columnHelper.accessor((skill) => getLocalizedName(skill.name, intl), {
      id: "name",
      header: intl.formatMessage({
        defaultMessage: "Skill name",
        id: "hjxxaQ",
        description: "Skill name column header for the skill library table",
      }),
      enableHiding: false,
      enableColumnFilter: false,
      sortingFn: normalizedText,
      meta: {
        isRowTitle: true,
      },
    }),
  ] as ColumnDef<
    Skill & {
      poolSkillId: string;
      requiredLevel?: SkillLevel;
    }
  >[];

  if (!disableAdd) {
    columns = [
      ...columns,
      columnHelper.display({
        id: "edit",
        enableHiding: false,
        header: intl.formatMessage({
          defaultMessage: "Remove",
          id: "yBZaZy",
          description: "Header for the remove column on a skill table",
        }),
        meta: {
          hideMobileHeader: true,
        },
        cell: ({ row: { original: skill } }) =>
          removeCell(skill, handleRemove, intl),
      }),
    ];
  }

  return (
    <Table<
      Skill & {
        poolSkillId: string;
        requiredLevel?: SkillLevel;
      }
    >
      caption={caption}
      data={data}
      columns={columns}
      urlSync={false}
      add={
        !disableAdd
          ? {
              component: (
                <SkillBrowserDialog
                  context="pool"
                  showCategory={false}
                  skills={availableSkills}
                  onSave={async (value) => {
                    if (value.skill) {
                      onCreate(value.skill, SkillLevel.Beginner);
                    }
                  }}
                />
              ),
            }
          : undefined
      }
      sort={{
        internal: true,
      }}
      pagination={{
        internal: true,
        total: data.length,
        pageSizes: [10, 20, 50],
      }}
      nullMessage={nullMessage}
    />
  );
};

export default SkillTable;
