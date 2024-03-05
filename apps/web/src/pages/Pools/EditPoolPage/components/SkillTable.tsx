import React from "react";
import { useIntl } from "react-intl";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import TrashIcon from "@heroicons/react/20/solid/TrashIcon";
import PencilSquareIcon from "@heroicons/react/20/solid/PencilSquareIcon";

import { commonMessages, getLocalizedName } from "@gc-digital-talent/i18n";
import { Button } from "@gc-digital-talent/ui";
import { SkillCategory, SkillLevel, Skill } from "@gc-digital-talent/graphql";

import Table from "~/components/Table/ResponsiveTable/ResponsiveTable";
import SkillBrowserDialog from "~/components/SkillBrowser/SkillBrowserDialog";
import { normalizedText } from "~/components/Table/sortingFns";
import { NullMessageProps } from "~/components/Table/ResponsiveTable/NullMessage";
import { getUserSkillLevelAndDefinition } from "~/utils/skillUtils";

const columnHelper = createColumnHelper<
  Skill & {
    poolSkillId: string;
    requiredLevel?: SkillLevel;
  }
>();

const ActionCell = (
  skill: Skill & {
    poolSkillId: string;
    requiredLevel?: SkillLevel;
  },
  onUpdate: (id: string, skillLevel: SkillLevel) => Promise<void>,
  onRemove: (poolSkillSelected: string) => Promise<void>,
) => {
  const intl = useIntl();
  const [isOpen] = React.useState<boolean>(false);
  const { poolSkillId, name } = skill;
  const localizedName = getLocalizedName(name, intl);

  return (
    <div
      data-h2-display="base(flex)"
      data-h2-flex-wrap="base(wrap)"
      data-h2-gap="base(x.25)"
    >
      <SkillBrowserDialog
        context="pool"
        defaultOpen={isOpen}
        showCategory={false}
        customTrigger={
          <Button
            icon={PencilSquareIcon}
            color="success"
            mode="inline"
            aria-label={intl.formatMessage(
              {
                defaultMessage: "Edit {skillName}",
                id: "F6L/Rv",
                description: "Edit a skill",
              },
              {
                skillName: localizedName,
              },
            )}
          />
        }
        skills={[skill]}
        onSave={async (value) => {
          if (value.skill && value.skillLevel) {
            onUpdate(poolSkillId, value.skillLevel);
          }
        }}
      />
      <Button
        color="error"
        mode="inline"
        icon={TrashIcon}
        onClick={() => onRemove(poolSkillId)}
        aria-label={intl.formatMessage(
          {
            defaultMessage: "Remove {skillName}",
            id: "eqX3mk",
            description: "Remove a skill",
          },
          {
            skillName: localizedName,
          },
        )}
      />
    </div>
  );
};

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
  onUpdate,
  onRemove,
}: SkillTableProps) => {
  const intl = useIntl();
  const availableSkills = allSkills.filter(
    (skill) => !data.find((value) => value.id === skill.id),
  );

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
    columnHelper.accessor(
      (skill) =>
        skill.requiredLevel
          ? getUserSkillLevelAndDefinition(
              skill.requiredLevel,
              skill.category === SkillCategory.Technical,
              intl,
            ).level
          : intl.formatMessage(commonMessages.notFound),
      {
        id: "level",
        header: intl.formatMessage({
          defaultMessage: "Level required",
          id: "91b+W0",
          description: "Required skill level column header for tables",
        }),
        enableHiding: false,
        enableColumnFilter: false,
        sortingFn: normalizedText,
        meta: {
          isRowTitle: true,
        },
      },
    ),
  ] as ColumnDef<
    Skill & {
      poolSkillId: string;
      requiredLevel?: SkillLevel;
    }
  >[];

  if (!disableAdd) {
    columns = [
      columnHelper.display({
        id: "actions",
        header: intl.formatMessage({
          defaultMessage: "Actions",
          id: "OxeGLu",
          description: "Title displayed for the team table actions column",
        }),
        cell: ({ row: { original: skill } }) =>
          ActionCell(skill, onUpdate, onRemove),
      }),
      ...columns,
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
                    if (value.skill && value.skillLevel) {
                      onCreate(value.skill, value.skillLevel);
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
