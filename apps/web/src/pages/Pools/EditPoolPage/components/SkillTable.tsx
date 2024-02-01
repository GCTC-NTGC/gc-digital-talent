import React from "react";
import { IntlShape, useIntl } from "react-intl";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";

import { getLocalizedName } from "@gc-digital-talent/i18n";
import { Button } from "@gc-digital-talent/ui";

import { Scalars, Skill } from "~/api/generated";
import Table from "~/components/Table/ResponsiveTable/ResponsiveTable";
import SkillBrowserDialog from "~/components/SkillBrowser/SkillBrowserDialog";
import { normalizedText } from "~/components/Table/sortingFns";

const columnHelper = createColumnHelper<Skill>();

const removeCell = (
  skill: Skill,
  onClick: (id: string) => void,
  intl: IntlShape,
) => (
  <Button
    type="button"
    mode="inline"
    color="black"
    onClick={() => onClick(skill.id)}
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
  data: Skill[];
  allSkills: Skill[];
  onSave: (submitData: Scalars["ID"][]) => Promise<void>;
  disableAdd?: boolean;
}

const SkillTable = ({
  caption,
  data,
  allSkills,
  onSave,
  disableAdd,
}: SkillTableProps) => {
  const intl = useIntl();
  const availableSkills = allSkills.filter(
    (skill) => !data.find((value) => value.id === skill.id),
  );

  const handleRemove = (id: string) => {
    onSave(data.filter((skill) => skill.id !== id).map((skill) => skill.id));
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
  ] as ColumnDef<Skill>[];

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
        cell: ({ row: { original: department } }) =>
          removeCell(department, handleRemove, intl),
      }),
    ];
  }

  return (
    <Table<Skill>
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
                      onSave([...data.map((skill) => skill.id), value.skill]);
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
    />
  );
};

export default SkillTable;
