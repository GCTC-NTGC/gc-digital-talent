import type { ColumnDef } from "@tanstack/react-table";
import { createColumnHelper } from "@tanstack/react-table";
import { useIntl } from "react-intl";
import { useLocation } from "react-router";

import { notEmpty } from "@gc-digital-talent/helpers";
import { Link } from "@gc-digital-talent/ui";
import type {
  DevelopmentProgramTableRowFragment,
  FragmentType,
} from "@gc-digital-talent/graphql";
import { graphql, getFragment } from "@gc-digital-talent/graphql";
import { commonMessages } from "@gc-digital-talent/i18n";

import Table from "~/components/Table/ResponsiveTable/ResponsiveTable";
import useRoutes from "~/hooks/useRoutes";
import adminMessages from "~/messages/adminMessages";

const columnHelper = createColumnHelper<DevelopmentProgramTableRowFragment>();

const DevelopmentProgramTableRow_Fragment = graphql(/* GraphQL */ `
  fragment DevelopmentProgramTableRow on DevelopmentProgram {
    id
    name {
      localized
    }
  }
`);

interface DevelopmentProgramTableProps {
  developmentProgramQuery: FragmentType<
    typeof DevelopmentProgramTableRow_Fragment
  >[];
  title: string;
}

const DevelopmentProgramTable = ({
  developmentProgramQuery,
  title,
}: DevelopmentProgramTableProps) => {
  const intl = useIntl();
  const routes = useRoutes();
  const developmentPrograms = getFragment(
    DevelopmentProgramTableRow_Fragment,
    developmentProgramQuery,
  );

  const { pathname, search, hash } = useLocation();
  const currentUrl = `${pathname}${search}${hash}`;

  const columns = [
    columnHelper.accessor((row) => row?.name?.localized, {
      id: "name",
      header: intl.formatMessage(commonMessages.name),
      cell: ({ row: { original: developmentProgram } }) => (
        <Link href={routes.developmentProgramView(developmentProgram.id)}>
          {developmentProgram?.name?.localized}
        </Link>
      ),
      meta: {
        isRowTitle: true,
      },
    }),
  ] as ColumnDef<DevelopmentProgramTableRowFragment>[];

  const data = developmentPrograms.filter(notEmpty);

  return (
    <Table<DevelopmentProgramTableRowFragment>
      data={data}
      caption={title}
      columns={columns}
      sort={{
        internal: true,
      }}
      pagination={{
        internal: true,
        total: data.length,
        pageSizes: [10, 20, 50, 100, 500],
      }}
      search={{
        internal: true,
        label: intl.formatMessage(adminMessages.searchByKeyword),
      }}
      add={{
        linkProps: {
          href: routes.developmentProgramCreate(),
          label: intl.formatMessage({
            defaultMessage: "Create development program",
            id: "epvtIj",
            description: "Text to create a development program",
          }),
          from: currentUrl,
        },
      }}
      nullMessage={{
        description: intl.formatMessage({
          defaultMessage:
            'Use the "Create development program" button to get started.',
          id: "xa2uKa",
          description: "Instructions for adding a development program item",
        }),
      }}
    />
  );
};

export default DevelopmentProgramTable;
