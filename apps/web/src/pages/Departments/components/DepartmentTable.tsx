import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { useIntl } from "react-intl";
import { useLocation } from "react-router";
import { useQuery } from "urql";

import { notEmpty, unpackMaybes } from "@gc-digital-talent/helpers";
import { commonMessages, getLocalizedName } from "@gc-digital-talent/i18n";
import { Link, Pending } from "@gc-digital-talent/ui";
import {
  graphql,
  DepartmentTableRowFragment,
  FragmentType,
  getFragment,
} from "@gc-digital-talent/graphql";

import useRoutes from "~/hooks/useRoutes";
import Table from "~/components/Table/ResponsiveTable/ResponsiveTable";
import { normalizedText } from "~/components/Table/sortingFns";
import adminMessages from "~/messages/adminMessages";

const columnHelper = createColumnHelper<DepartmentTableRowFragment>();

export const DepartmentTableRow_Fragment = graphql(/* GraphQL */ `
  fragment DepartmentTableRow on Department {
    id
    departmentNumber
    name {
      en
      fr
    }
  }
`);

interface DepartmentTableProps {
  departmentsQuery: FragmentType<typeof DepartmentTableRow_Fragment>[];
  title: string;
}

export const DepartmentTable = ({
  departmentsQuery,
  title,
}: DepartmentTableProps) => {
  const intl = useIntl();
  const paths = useRoutes();
  const departments = getFragment(
    DepartmentTableRow_Fragment,
    departmentsQuery,
  );
  const columns = [
    columnHelper.accessor((row) => getLocalizedName(row.name, intl), {
      id: "name",
      sortingFn: normalizedText,
      header: intl.formatMessage(commonMessages.name),
      cell: ({ row: { original: department } }) => (
        <Link href={paths.departmentView(department.id)}>
          {getLocalizedName(department.name, intl)}
        </Link>
      ),
      meta: {
        isRowTitle: true,
      },
    }),
    columnHelper.accessor("departmentNumber", {
      id: "departmentNumber",
      filterFn: "weakEquals",
      header: intl.formatMessage({
        defaultMessage: "Number",
        id: "af1unJ",
        description:
          "Title displayed for the Department table Department # column.",
      }),
    }),
  ] as ColumnDef<DepartmentTableRowFragment>[];

  const data = departments.filter(notEmpty);

  const { pathname, search, hash } = useLocation();
  const currentUrl = `${pathname}${search}${hash}`;

  return (
    <Table<DepartmentTableRowFragment>
      data={data}
      caption={title}
      columns={columns}
      sort={{
        internal: true,
      }}
      pagination={{
        internal: true,
        total: data.length,
        pageSizes: [10, 20, 50],
      }}
      search={{
        internal: true,
        label: intl.formatMessage(adminMessages.searchByKeyword),
      }}
      add={{
        linkProps: {
          href: paths.departmentCreate(),
          label: intl.formatMessage({
            defaultMessage: "Create department",
            id: "WIbjog",
            description: "Heading displayed above the Create Department form.",
          }),
          from: currentUrl,
        },
      }}
      nullMessage={{
        description: intl.formatMessage({
          defaultMessage: 'Use the "Create department" button to get started.',
          id: "kiJviy",
          description: "Instructions for adding a department item.",
        }),
      }}
    />
  );
};

const Departments_Query = graphql(/* GraphQL */ `
  query Departments {
    departments {
      ...DepartmentTableRow
    }
  }
`);

const DepartmentTableApi = ({ title }: { title: string }) => {
  const [{ data, fetching, error }] = useQuery({ query: Departments_Query });

  return (
    <Pending fetching={fetching} error={error}>
      <DepartmentTable
        departmentsQuery={unpackMaybes(data?.departments)}
        title={title}
      />
    </Pending>
  );
};

export default DepartmentTableApi;
