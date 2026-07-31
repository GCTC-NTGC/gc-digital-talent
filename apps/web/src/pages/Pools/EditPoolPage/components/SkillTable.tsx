import { useState } from "react";
import { useIntl } from "react-intl";
import type { ColumnDef } from "@tanstack/react-table";
import { createColumnHelper } from "@tanstack/react-table";
import TrashIcon from "@heroicons/react/20/solid/TrashIcon";
import PencilSquareIcon from "@heroicons/react/20/solid/PencilSquareIcon";

import {
  commonMessages,
  getLocalizedName,
  getSkillLevelName,
} from "@gc-digital-talent/i18n";
import { Button } from "@gc-digital-talent/ui";
import type {
  SkillLevel,
  FragmentType,
  SkillTablePoolSkillFragment,
} from "@gc-digital-talent/graphql";
import { getFragment, graphql } from "@gc-digital-talent/graphql";

import Table from "~/components/Table/ResponsiveTable/ResponsiveTable";
import SkillBrowserDialog from "~/components/SkillBrowser/SkillBrowserDialog";
import { normalizedText } from "~/components/Table/sortingFns";
import type { NullMessageProps } from "~/components/Table/ResponsiveTable/NullMessage";
import tableMessages from "~/components/Table/tableMessages";

export const SkillTableSkill_Fragment = graphql(/* GraphQL */ `
  fragment SkillTableSkill on Skill {
    id
    key
    name {
      en
      fr
      localized
    }
    description {
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
    families {
      id
      key
    }
  }
`);

export const SkillTablePoolSkill_Fragment = graphql(/* GraphQL */ `
  fragment SkillTablePoolSkill on PoolSkill {
    id
    requiredLevel
    skill {
      id
      key
      name {
        en
        fr
        localized
      }
      description {
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
      families {
        id
        key
      }
    }
  }
`);

const columnHelper = createColumnHelper<SkillTablePoolSkillFragment>();

const ActionCell = (
  poolSkill: SkillTablePoolSkillFragment,
  onUpdate: (id: string, skillLevel: SkillLevel) => Promise<void>,
  onRemove: (poolSkillSelected: string) => Promise<void>,
) => {
  const intl = useIntl();
  const [isOpen] = useState<boolean>(false);
  const { id: poolSkillId, requiredLevel, skill } = poolSkill;
  const localizedName =
    skill?.name?.localized ?? intl.formatMessage(commonMessages.notAvailable);

  return (
    <div className="flex flex-wrap gap-1.5">
      <SkillBrowserDialog
        context="pool"
        defaultOpen={isOpen}
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
        skills={skill ? [skill] : []}
        initialState={{
          family: "all",
          skill: skill?.id,
          skillLevel: requiredLevel ?? undefined,
        }}
        onSave={async (value) => {
          if (value.skill && value.skillLevel) {
            await onUpdate(poolSkillId, value.skillLevel);
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
  poolSkillsQuery: FragmentType<typeof SkillTablePoolSkill_Fragment>[];
  allSkillsQuery: FragmentType<typeof SkillTableSkill_Fragment>[];
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
  poolSkillsQuery,
  allSkillsQuery,
  disableAdd,
  nullMessage,
  onCreate,
  onUpdate,
  onRemove,
}: SkillTableProps) => {
  const intl = useIntl();
  const data = getFragment(SkillTablePoolSkill_Fragment, poolSkillsQuery);
  const allSkills = getFragment(SkillTableSkill_Fragment, allSkillsQuery);
  const availableSkills = allSkills.filter(
    (skill) => !data.find((poolSkill) => poolSkill.skill?.id === skill.id),
  );

  let columns = [
    columnHelper.accessor(
      (poolSkill) =>
        poolSkill.skill?.name?.localized ??
        intl.formatMessage(commonMessages.notAvailable),
      {
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
      },
    ),
    columnHelper.accessor(
      (poolSkill) =>
        poolSkill.requiredLevel && poolSkill.skill
          ? intl.formatMessage(
              getSkillLevelName(
                poolSkill.requiredLevel,
                poolSkill.skill.category.value,
              ),
            )
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
  ] as ColumnDef<SkillTablePoolSkillFragment>[];

  if (!disableAdd) {
    columns = [
      columnHelper.display({
        id: "actions",
        header: intl.formatMessage(tableMessages.actions),
        cell: ({ row: { original: poolSkill } }) =>
          ActionCell(poolSkill, onUpdate, onRemove),
      }),
      ...columns,
    ];
  }

  return (
    <Table<SkillTablePoolSkillFragment>
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
                  skills={availableSkills}
                  onSave={async (value) => {
                    if (value.skill && value.skillLevel) {
                      await onCreate(value.skill, value.skillLevel);
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
        pageSizes: [10, 20, 50, 100, 500],
      }}
      nullMessage={nullMessage}
    />
  );
};

export default SkillTable;
