import React from "react";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { useIntl } from "react-intl";

import { getLocalizedName } from "@gc-digital-talent/i18n";
import { notEmpty } from "@gc-digital-talent/helpers";
import { Pending } from "@gc-digital-talent/ui";

import useRoutes from "~/hooks/useRoutes";
import { SkillFamily, useAllSkillFamiliesQuery } from "~/api/generated";
import Table from "~/components/Table/ResponsiveTable/ResponsiveTable";
import cells from "~/components/Table/cells";
import adminMessages from "~/messages/adminMessages";

const columnHelper = createColumnHelper<SkillFamily>();

interface SkillFamilyTableProps {
  skillFamilies: Array<SkillFamily>;
  title: string;
}

export const SkillFamilyTable = ({
  skillFamilies,
  title,
}: SkillFamilyTableProps) => {
  const intl = useIntl();
  const paths = useRoutes();
  const columns = [
    columnHelper.accessor("id", {
      id: "id",
      enableColumnFilter: false,
      header: intl.formatMessage(adminMessages.id),
    }),
    columnHelper.accessor(
      (skillFamily) => getLocalizedName(skillFamily.name, intl),
      {
        id: "name",
        header: intl.formatMessage({
          defaultMessage: "Name",
          id: "VphXhu",
          description:
            "Title displayed for the Skill Family table Name column.",
        }),
        meta: {
          isRowTitle: true,
        },
      },
    ),
    columnHelper.accessor(
      (skillFamily) => getLocalizedName(skillFamily.description, intl, true),
      {
        id: "description",
        header: intl.formatMessage({
          defaultMessage: "Description",
          id: "XSo129",
          description:
            "Title displayed for the Skill Family table Description column.",
        }),
      },
    ),
    columnHelper.display({
      id: "edit",
      header: intl.formatMessage(adminMessages.edit),
      meta: {
        hideMobileHeader: true,
      },
      cell: ({ row: { original: skillFamily } }) =>
        cells.edit(
          skillFamily.id,
          paths.skillFamilyTable(),
          getLocalizedName(skillFamily.name, intl),
        ),
    }),
  ] as ColumnDef<SkillFamily>[];

  const data = skillFamilies.filter(notEmpty);

  return (
    <Table<SkillFamily>
      caption={title}
      data={data}
      columns={columns}
      hiddenColumnIds={["id"]}
      pagination={{
        internal: true,
        total: data.length,
        pageSizes: [10, 20, 50],
      }}
      sort={{
        internal: true,
      }}
      search={{
        internal: true,
        label: intl.formatMessage({
          defaultMessage: "Search skill families",
          id: "yXwlJw",
          description: "Label for the skill families table search input",
        }),
      }}
      add={{
        linkProps: {
          href: paths.skillFamilyCreate(),
          label: intl.formatMessage({
            defaultMessage: "Create Skill Family",
            id: "TRqbR/",
            description:
              "Heading displayed above the Create Skill Family form.",
          }),
        },
      }}
    />
  );
};

const SkillFamilyTableApi = ({ title }: { title: string }) => {
  const [result] = useAllSkillFamiliesQuery();
  const { data, fetching, error } = result;

  const skillFamilies = data?.skillFamilies.filter(notEmpty);

  return (
    <Pending fetching={fetching} error={error}>
      <SkillFamilyTable skillFamilies={skillFamilies || []} title={title} />
    </Pending>
  );
};

export default SkillFamilyTableApi;
