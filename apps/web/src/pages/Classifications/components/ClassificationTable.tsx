import React from "react";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { useIntl } from "react-intl";
import { OperationContext } from "urql";

import { notEmpty } from "@gc-digital-talent/helpers";
import { getLocale, getLocalizedName } from "@gc-digital-talent/i18n";
import { Pending } from "@gc-digital-talent/ui";

import {
  GetClassificationsQuery,
  useGetClassificationsQuery,
  Classification,
} from "~/api/generated";
import useRoutes from "~/hooks/useRoutes";
import Table from "~/components/Table/ResponsiveTable/ResponsiveTable";
import tableEditButtonAccessor from "~/components/Table/EditButton";

const columnHelper = createColumnHelper<Classification>();

interface ClassificationTableProps {
  classifications: GetClassificationsQuery["classifications"];
  title: string;
}

export const ClassificationTable = ({
  classifications,
  title,
}: ClassificationTableProps) => {
  const intl = useIntl();
  const locale = getLocale(intl);
  const paths = useRoutes();
  const columns = [
    columnHelper.accessor("id", {
      id: "id",
      enableColumnFilter: false,
      header: intl.formatMessage({
        defaultMessage: "ID",
        id: "VqyL+/",
        description: "Title displayed on the Classification table ID column.",
      }),
    }),
    columnHelper.accessor((row) => getLocalizedName(row.name, intl), {
      id: "name",
      enableColumnFilter: true,
      enableSorting: true,
      meta: {
        isRowTitle: true,
      },
      header: intl.formatMessage({
        defaultMessage: "Name",
        id: "HUCIzc",
        description:
          "Title displayed for the Classification table Name column.",
      }),
    }),
    columnHelper.accessor("group", {
      id: "group",
      enableColumnFilter: false,
      enableSorting: true,
      header: intl.formatMessage({
        defaultMessage: "Group",
        id: "aS4Lty",
        description:
          "Title displayed for the Classification table Group column.",
      }),
    }),
    columnHelper.accessor("level", {
      id: "level",
      enableColumnFilter: false,
      enableSorting: true,
      header: intl.formatMessage({
        defaultMessage: "Level",
        id: "yZqUAU",
        description:
          "Title displayed for the Classification table Level column.",
      }),
    }),
    columnHelper.accessor("minSalary", {
      id: "minSalary",
      enableColumnFilter: false,
      enableSorting: true,
      header: intl.formatMessage({
        defaultMessage: "Minimum Salary",
        id: "9c/MAZ",
        description:
          "Title displayed for the Classification table Minimum Salary column.",
      }),
    }),
    columnHelper.accessor("maxSalary", {
      id: "maxSalary",
      enableColumnFilter: false,
      enableSorting: true,
      header: intl.formatMessage({
        defaultMessage: "Maximum Salary",
        id: "Ke0TPJ",
        description:
          "Title displayed for the Classification table Maximum Salary column.",
      }),
    }),
    columnHelper.display({
      id: "edit",
      header: intl.formatMessage({
        defaultMessage: "Edit",
        id: "D753gS",
        description:
          "Title displayed for the Classification table Edit column.",
      }),
      meta: {
        hideMobileHeader: true,
      },
      cell: ({ row: { original: classification } }) =>
        tableEditButtonAccessor(
          classification.id,
          paths.classificationTable(),
          `${classification.name?.[locale]} ${classification.group}-0${classification.level}`,
        ),
    }),
  ] as ColumnDef<Classification>[];

  const data = classifications.filter(notEmpty);

  return (
    <Table<Classification>
      caption={title}
      data={data}
      columns={columns}
      hiddenColumnIds={["id", "minSalary", "maxSalary"]}
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
          defaultMessage: "Search classifications",
          id: "5tmTP/",
          description: "Label for the classifications table search input",
        }),
      }}
      add={{
        linkProps: {
          href: paths.classificationCreate(),
          label: intl.formatMessage({
            defaultMessage: "Create Classification",
            id: "DexZJJ",
            description:
              "Heading displayed above the Create Classification form.",
          }),
        },
      }}
    />
  );
};

const context: Partial<OperationContext> = {
  additionalTypenames: ["Classification"], // This lets urql know when to invalidate cache if request returns empty list. https://formidable.com/open-source/urql/docs/basics/document-caching/#document-cache-gotchas
  requestPolicy: "cache-first", // The list of classifications will rarely change, so we override default request policy to avoid unnecessary cache updates.
};

const ClassificationTableApi = ({ title }: { title: string }) => {
  const [result] = useGetClassificationsQuery({
    context,
  });
  const { data, fetching, error } = result;

  return (
    <Pending fetching={fetching} error={error}>
      <ClassificationTable
        classifications={data?.classifications ?? []}
        title={title}
      />
    </Pending>
  );
};

export default ClassificationTableApi;
