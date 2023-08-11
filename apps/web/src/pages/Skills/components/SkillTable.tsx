import React from "react";
import { useIntl } from "react-intl";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { OperationContext } from "urql";

import { Locales, getLocale, getLocalizedName } from "@gc-digital-talent/i18n";
import { notEmpty } from "@gc-digital-talent/helpers";
import { Pill, Pending } from "@gc-digital-talent/ui";

import useRoutes from "~/hooks/useRoutes";
import { Maybe, Skill, SkillFamily, useAllSkillsQuery } from "~/api/generated";
import Table from "~/components/Table/ResponsiveTable/ResponsiveTable";
import { tableEditButtonAccessor } from "~/components/Table/ClientManagedTable";
import adminMessages from "~/messages/adminMessages";

const keywordAccessor = (skill: Skill, locale: Locales) => {
  const keywords = skill.keywords
    ? skill.keywords[locale]?.filter(notEmpty)
    : [];

  return keywords?.join(", ");
};

const skillFamilyAccessor = (skill: Skill, locale: Locales) =>
  skill.families
    ?.map((family) => family?.name?.[locale])
    .filter(notEmpty)
    .sort()
    .join(", ");

const skillFamiliesCell = (
  skillFamilies: Maybe<Maybe<SkillFamily>[]>,
  locale: "en" | "fr",
) => {
  const families = skillFamilies?.filter(notEmpty).map((family) => (
    <Pill color="primary" mode="outline" key={family?.key}>
      {family?.name?.[locale]}
    </Pill>
  ));

  return families ? <span>{families}</span> : null;
};

const columnHelper = createColumnHelper<Skill>();

interface SkillTableProps {
  skills: Array<Skill>;
  title: string;
}

export const SkillTable = ({ skills, title }: SkillTableProps) => {
  const intl = useIntl();
  const locale = getLocale(intl);
  const paths = useRoutes();
  const columns = [
    columnHelper.accessor("id", {
      id: "id",
      header: intl.formatMessage({
        defaultMessage: "ID",
        id: "Z6o8ym",
        description: "Title displayed on the Skill table ID column.",
      }),
    }),
    columnHelper.accessor((row) => getLocalizedName(row.name, intl), {
      id: "name",
      enableColumnFilter: true,
      header: intl.formatMessage({
        defaultMessage: "Name",
        id: "BOeBpE",
        description: "Title displayed for the skill table Name column.",
      }),
      meta: {
        isRowTitle: true,
      },
    }),
    columnHelper.accessor((row) => getLocalizedName(row.description, intl), {
      id: "description",
      enableColumnFilter: true,
      header: intl.formatMessage({
        defaultMessage: "Description",
        id: "9yGJ6k",
        description: "Title displayed for the skill table Description column.",
      }),
    }),
    columnHelper.accessor((row) => keywordAccessor(row, locale), {
      id: "keywords",
      header: intl.formatMessage({
        defaultMessage: "Keywords",
        id: "I7rxxQ",
        description: "Title displayed for the skill table Keywords column.",
      }),
    }),
    columnHelper.accessor((row) => skillFamilyAccessor(row, locale), {
      id: "skillFamilies",
      header: intl.formatMessage(adminMessages.skillFamilies),
      cell: ({ row }) => skillFamiliesCell(row.original.families, locale),
    }),
    columnHelper.display({
      id: "edit",
      header: intl.formatMessage({
        defaultMessage: "Edit",
        id: "X4nVv/",
        description: "Title displayed for the skill table Edit column.",
      }),
      meta: {
        hideInColumnDialog: true,
        hideMobileHeader: true,
      },
      cell: ({ row }) =>
        tableEditButtonAccessor(
          row.original.id,
          paths.skillTable(),
          row.original.name?.[locale],
        ),
    }),
  ] as ColumnDef<object>[];

  const data: Skill[] = skills.filter(notEmpty);

  return (
    <Table
      data={data}
      columns={columns}
      hiddenColumnIds={["id"]}
      caption={title}
      sort={{ internal: true }}
      search={{
        internal: true,
        label: intl.formatMessage({
          defaultMessage: "Search skills",
          id: "cWqtEU",
          description: "Label for the skills table search input",
        }),
      }}
      pagination={{
        internal: true,
        total: data.length,
      }}
      add={{
        href: paths.skillCreate(),
        label: intl.formatMessage({
          defaultMessage: "Create Skill",
          id: "lFrPv1",
          description: "Heading displayed above the Create Skill form.",
        }),
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
