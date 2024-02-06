import React from "react";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { useIntl } from "react-intl";
import { OperationContext } from "urql";
import { useLocation } from "react-router-dom";

import { notEmpty } from "@gc-digital-talent/helpers";
import { commonMessages, getLocalizedName } from "@gc-digital-talent/i18n";
import { Pending } from "@gc-digital-talent/ui";

import {
  GetClassificationsQuery,
  useGetClassificationsQuery,
  Classification,
} from "~/api/generated";
import useRoutes from "~/hooks/useRoutes";
import Table from "~/components/Table/ResponsiveTable/ResponsiveTable";
import cells from "~/components/Table/cells";
import adminMessages from "~/messages/adminMessages";
import { normalizedText } from "~/components/Table/sortingFns";

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
  const paths = useRoutes();
  const columns = [
    columnHelper.accessor("id", {
      id: "id",
      enableColumnFilter: false,
      header: intl.formatMessage(adminMessages.id),
    }),
    columnHelper.accessor((row) => getLocalizedName(row.name, intl), {
      id: "name",
      meta: {
        isRowTitle: true,
      },
      sortingFn: normalizedText,
      header: intl.formatMessage(commonMessages.name),
    }),
    columnHelper.accessor("group", {
      id: "group",
      enableColumnFilter: false,
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
      header: intl.formatMessage({
        defaultMessage: "Maximum Salary",
        id: "Ke0TPJ",
        description:
          "Title displayed for the Classification table Maximum Salary column.",
      }),
    }),
    columnHelper.display({
      id: "edit",
      header: intl.formatMessage(adminMessages.edit),
      cell: ({ row: { original: classification } }) =>
        cells.edit(
          classification.id,
          paths.classificationTable(),
          `${getLocalizedName(classification.name, intl, true)} ${
            classification.group
          }-0${classification.level}`,
        ),
    }),
  ] as ColumnDef<Classification>[];

  const data = classifications.filter(notEmpty);

  const { pathname, search, hash } = useLocation();
  const currentUrl = `${pathname}${search}${hash}`;

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
          from: currentUrl,
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
