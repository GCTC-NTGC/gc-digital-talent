import React from "react";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { useIntl } from "react-intl";
import { OperationContext } from "urql";

import { getLocalizedName } from "@gc-digital-talent/i18n";
import { notEmpty } from "@gc-digital-talent/helpers";
import { Pending } from "@gc-digital-talent/ui";

import useRoutes from "~/hooks/useRoutes";
import { Skill, useAllSkillsQuery } from "~/api/generated";
import Table from "~/components/Table/ResponsiveTable/ResponsiveTable";
import cells from "~/components/Table/cells";
import adminMessages from "~/messages/adminMessages";
import { diacritic } from "~/components/Table/sortingFns";

import {
  categoryAccessor,
  familiesAccessor,
  keywordsAccessor,
  skillFamiliesCell,
} from "./tableHelpers";

const columnHelper = createColumnHelper<Skill>();

interface SkillTableProps {
  skills: Array<Skill>;
  title: string;
}

export const SkillTable = ({ skills, title }: SkillTableProps) => {
  const intl = useIntl();
  const paths = useRoutes();
  const columns = [
    columnHelper.accessor("id", {
      id: "id",
      enableColumnFilter: false,
      header: intl.formatMessage(adminMessages.id),
    }),
    columnHelper.accessor((skill) => getLocalizedName(skill.name, intl), {
      id: "name",
      header: intl.formatMessage({
        defaultMessage: "Name",
        id: "BOeBpE",
        description: "Title displayed for the skill table Name column.",
      }),
      sortingFn: diacritic,
      meta: {
        isRowTitle: true,
      },
    }),
    columnHelper.accessor(
      (skill) => getLocalizedName(skill.description, intl, true),
      {
        id: "description",
        sortingFn: diacritic,
        header: intl.formatMessage({
          defaultMessage: "Description",
          id: "9yGJ6k",
          description:
            "Title displayed for the skill table Description column.",
        }),
      },
    ),
    columnHelper.accessor((skill) => keywordsAccessor(skill, intl), {
      id: "keywords",
      header: intl.formatMessage({
        defaultMessage: "Keywords",
        id: "I7rxxQ",
        description: "Title displayed for the skill table Keywords column.",
      }),
    }),
    columnHelper.accessor((skill) => familiesAccessor(skill, intl), {
      id: "skillFamilies",
      header: intl.formatMessage(adminMessages.skillFamilies),
      cell: ({ row: { original: skill } }) =>
        skillFamiliesCell(skill.families, intl),
    }),
    columnHelper.accessor(({ category }) => categoryAccessor(category, intl), {
      id: "category",
      header: intl.formatMessage({
        defaultMessage: "Category",
        id: "m5RwGF",
        description:
          "Title displayed for the Skill Family table Category column.",
      }),
    }),
    columnHelper.display({
      id: "edit",
      header: intl.formatMessage(adminMessages.edit),
      cell: ({ row: { original: skill } }) =>
        cells.edit(
          skill.id,
          paths.skillTable(),
          getLocalizedName(skill.name, intl),
        ),
    }),
  ] as ColumnDef<Skill>[];

  const data = skills.filter(notEmpty);

  return (
    <Table<Skill>
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
          defaultMessage: "Search skills",
          id: "cWqtEU",
          description: "Label for the skills table search input",
        }),
      }}
      add={{
        linkProps: {
          href: paths.skillCreate(),
          label: intl.formatMessage({
            defaultMessage: "Create Skill",
            id: "lFrPv1",
            description: "Heading displayed above the Create Skill form.",
          }),
        },
      }}
    />
  );
};

const context: Partial<OperationContext> = {
  additionalTypenames: ["Skill", "SkillFamily"], // This lets urql know when to invalidate cache if request returns empty list. https://formidable.com/open-source/urql/docs/basics/document-caching/#document-cache-gotchas
  requestPolicy: "cache-first", // The list of skills will rarely change, so we override default request policy to avoid unnecessary cache updates.
};

const SkillTableApi = ({ title }: { title: string }) => {
  const [result] = useAllSkillsQuery({
    context,
  });
  const { data, fetching, error } = result;

  const skills = data?.skills.filter(notEmpty);

  return (
    <Pending fetching={fetching} error={error}>
      <SkillTable skills={skills || []} title={title} />
    </Pending>
  );
};

export default SkillTableApi;
