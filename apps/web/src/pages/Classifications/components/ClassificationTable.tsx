import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { useIntl } from "react-intl";
import { OperationContext, useQuery } from "urql";
import { useLocation } from "react-router";

import { unpackMaybes } from "@gc-digital-talent/helpers";
import { commonMessages } from "@gc-digital-talent/i18n";
import { Link, Pending } from "@gc-digital-talent/ui";
import {
  graphql,
  FragmentType,
  getFragment,
  ClassificationTableRowFragment,
} from "@gc-digital-talent/graphql";

import useRoutes from "~/hooks/useRoutes";
import Table from "~/components/Table/ResponsiveTable/ResponsiveTable";
import adminMessages from "~/messages/adminMessages";
import { normalizedText } from "~/components/Table/sortingFns";
import { getClassificationName } from "~/utils/poolUtils";

export const ClassificationTableRow_Fragment = graphql(/* GraphQL */ `
  fragment ClassificationTableRow on Classification {
    id
    name {
      en
      fr
    }
    group
    level
    minSalary
    maxSalary
  }
`);

const columnHelper = createColumnHelper<ClassificationTableRowFragment>();

interface ClassificationTableProps {
  classificationsQuery: FragmentType<typeof ClassificationTableRow_Fragment>[];
  title: string;
}

export const ClassificationTable = ({
  classificationsQuery,
  title,
}: ClassificationTableProps) => {
  const intl = useIntl();
  const paths = useRoutes();
  const classifications = getFragment(
    ClassificationTableRow_Fragment,
    classificationsQuery,
  );
  const columns = [
    columnHelper.accessor("id", {
      id: "id",
      enableColumnFilter: false,
      header: intl.formatMessage(adminMessages.id),
    }),
    columnHelper.accessor((row) => getClassificationName(row, intl), {
      id: "name",
      meta: {
        isRowTitle: true,
      },
      sortingFn: normalizedText,
      header: intl.formatMessage(commonMessages.name),
      cell: ({
        getValue,
        row: {
          original: { id },
        },
      }) => <Link href={paths.classificationView(id)}>{getValue()}</Link>,
    }),
    columnHelper.accessor("group", {
      id: "group",
      enableColumnFilter: false,
      header: intl.formatMessage(commonMessages.group),
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
  ] as ColumnDef<ClassificationTableRowFragment>[];

  const { pathname, search, hash } = useLocation();

  return (
    <Table<ClassificationTableRowFragment>
      caption={title}
      data={classifications}
      columns={columns}
      hiddenColumnIds={["id", "minSalary", "maxSalary"]}
      pagination={{
        internal: true,
        total: classifications.length,
        pageSizes: [10, 20, 50],
      }}
      sort={{
        internal: true,
      }}
      search={{
        internal: true,
        label: intl.formatMessage(adminMessages.searchByKeyword),
      }}
      add={{
        linkProps: {
          href: paths.classificationCreate(),
          label: intl.formatMessage({
            defaultMessage: "Create classification",
            id: "NW7sCE",
            description: "Button text to create classification",
          }),
          from: `${pathname}${search}${hash}`,
        },
      }}
      nullMessage={{
        description: intl.formatMessage({
          defaultMessage:
            'Use the "Create classification" button to get started.',
          id: "KHmf+e",
          description: "Instructions for adding a classification item.",
        }),
      }}
    />
  );
};

const ClassificationTable_Query = graphql(/* GraphQL */ `
  query Classifications {
    classifications {
      ...ClassificationTableRow
    }
  }
`);

const context: Partial<OperationContext> = {
  additionalTypenames: ["Classification"], // This lets urql know when to invalidate cache if request returns empty list. https://formidable.com/open-source/urql/docs/basics/document-caching/#document-cache-gotchas
  requestPolicy: "cache-first", // The list of classifications will rarely change, so we override default request policy to avoid unnecessary cache updates.
};

const ClassificationTableApi = ({ title }: { title: string }) => {
  const [{ data, fetching, error }] = useQuery({
    query: ClassificationTable_Query,
    context,
  });

  return (
    <Pending fetching={fetching} error={error}>
      <ClassificationTable
        classificationsQuery={unpackMaybes(data?.classifications)}
        title={title}
      />
    </Pending>
  );
};

export default ClassificationTableApi;
