import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { useIntl } from "react-intl";
import { useLocation } from "react-router";
import { useQuery } from "urql";

import { unpackMaybes } from "@gc-digital-talent/helpers";
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

import { SIZE_SORT_ORDER, yesNoAccessor } from "../utils";
import labels from "../labels";

const columnHelper = createColumnHelper<DepartmentTableRowFragment>();

export const DepartmentTableRow_Fragment = graphql(/* GraphQL */ `
  fragment DepartmentTableRow on Department {
    id
    departmentNumber
    orgIdentifier
    isCorePublicAdministration
    isCentralAgency
    isScience
    isRegulatory
    name {
      en
      fr
    }
    size {
      value
      label {
        localized
      }
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
    columnHelper.accessor("orgIdentifier", {
      id: "orgIdentifier",
      filterFn: "weakEquals",
      header: intl.formatMessage(adminMessages.id),
    }),
    columnHelper.accessor(
      ({ isCorePublicAdministration }) =>
        yesNoAccessor(!!isCorePublicAdministration, intl),
      {
        id: "isCorePublicAdministration",
        header: intl.formatMessage({
          defaultMessage: "CPA",
          id: "nzn+y+",
          description:
            "Abbreviated column header for core public administration",
        }),
      },
    ),
    columnHelper.accessor(
      ({ isCentralAgency }) => yesNoAccessor(!!isCentralAgency, intl),
      {
        id: "isCentralAgency",
        header: intl.formatMessage(labels.centralAgency),
      },
    ),
    columnHelper.accessor(({ isScience }) => yesNoAccessor(!!isScience, intl), {
      id: "isScience",
      header: intl.formatMessage(labels.science),
    }),
    columnHelper.accessor(
      ({ isRegulatory }) => yesNoAccessor(!!isRegulatory, intl),
      {
        id: "isRegulatory",
        header: intl.formatMessage(labels.regulatory),
      },
    ),
    columnHelper.accessor(({ size }) => size?.value, {
      id: "size",
      header: intl.formatMessage(labels.departmentSize),
      cell: ({ row: { original: department } }) =>
        department?.size?.label.localized ?? "",
      sortingFn: ({ original: a }, { original: b }) => {
        const aPosition = SIZE_SORT_ORDER.indexOf(a.size?.value ?? null);
        const bPosition = SIZE_SORT_ORDER.indexOf(b.size?.value ?? null);
        if (aPosition >= 0 && bPosition >= 0) return aPosition - bPosition;
        if (aPosition >= 0 && bPosition < 0) return -1;
        if (aPosition < 0 && bPosition >= 0) return 1;
        return 0;
      },
    }),
  ] as ColumnDef<DepartmentTableRowFragment>[];

  const data = unpackMaybes(departments);

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
