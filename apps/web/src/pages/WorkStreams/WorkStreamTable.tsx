import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { useIntl } from "react-intl";
import { OperationContext, useQuery } from "urql";
import { useLocation } from "react-router";

import { unpackMaybes } from "@gc-digital-talent/helpers";
import { commonMessages, getLocalizedName } from "@gc-digital-talent/i18n";
import { Link, Pending } from "@gc-digital-talent/ui";
import {
  graphql,
  FragmentType,
  getFragment,
  WorkStreamTableRowFragment,
} from "@gc-digital-talent/graphql";

import useRoutes from "~/hooks/useRoutes";
import Table from "~/components/Table/ResponsiveTable/ResponsiveTable";
import adminMessages from "~/messages/adminMessages";
import { normalizedText } from "~/components/Table/sortingFns";

export const WorkStreamTableRow_Fragment = graphql(/* GraphQL */ `
  fragment WorkStreamTableRow on WorkStream {
    id
    name {
      en
      fr
    }
    plainLanguageName {
      en
      fr
    }
    community {
      id
      key
      name {
        en
        fr
      }
    }
  }
`);

const columnHelper = createColumnHelper<WorkStreamTableRowFragment>();

interface WorkStreamTableProps {
  workStreamsQuery: FragmentType<typeof WorkStreamTableRow_Fragment>[];
  title: string;
}

export const WorkStreamTable = ({
  workStreamsQuery,
  title,
}: WorkStreamTableProps) => {
  const intl = useIntl();
  const paths = useRoutes();
  const workStreams = getFragment(
    WorkStreamTableRow_Fragment,
    workStreamsQuery,
  );
  const columns = [
    columnHelper.accessor("id", {
      id: "id",
      enableColumnFilter: false,
      header: intl.formatMessage(adminMessages.id),
    }),
    columnHelper.accessor((row) => getLocalizedName(row.name, intl), {
      id: "name",
      sortingFn: normalizedText,
      header: intl.formatMessage(commonMessages.name),
      cell: ({ row: { original: workStream } }) => (
        <Link href={paths.workStreamView(workStream.id)}>
          {getLocalizedName(workStream.name, intl)}
        </Link>
      ),
      meta: {
        isRowTitle: true,
      },
    }),
    columnHelper.accessor(
      (row) => getLocalizedName(row.plainLanguageName, intl),
      {
        id: "plainLanguageName",
        sortingFn: normalizedText,
        header: intl.formatMessage({
          defaultMessage: "Plain language alternative",
          id: "ax3wZp",
          description:
            "Column header for plain language name in work streams table",
        }),
      },
    ),
    columnHelper.accessor(
      (row) => getLocalizedName(row.community?.name, intl),
      {
        id: "community",
        sortingFn: normalizedText,
        header: intl.formatMessage(adminMessages.community),
      },
    ),
  ] as ColumnDef<WorkStreamTableRowFragment>[];

  const { pathname, search, hash } = useLocation();

  return (
    <Table<WorkStreamTableRowFragment>
      caption={title}
      data={workStreams}
      columns={columns}
      hiddenColumnIds={["id"]}
      pagination={{
        internal: true,
        total: workStreams.length,
        pageSizes: [10, 20, 50],
        initialState: {
          pageIndex: 0,
          pageSize: 50,
        },
      }}
      sort={{
        internal: true,
        initialState: [{ id: "community", desc: false }],
      }}
      search={{
        internal: true,
        label: intl.formatMessage(adminMessages.searchByKeyword),
      }}
      add={{
        linkProps: {
          href: paths.workStreamCreate(),
          label: intl.formatMessage({
            defaultMessage: "Create work stream",
            id: "jkY75T",
            description: "Button text to create a work stream",
          }),
          from: `${pathname}${search}${hash}`,
        },
      }}
      nullMessage={{
        description: intl.formatMessage({
          defaultMessage: 'Use the "Create work stream" button to get started.',
          id: "9HEVBb",
          description: "Instructions for adding a work stream item.",
        }),
      }}
    />
  );
};

const WorkStreamTable_Query = graphql(/* GraphQL */ `
  query WorkStreams {
    workStreams {
      ...WorkStreamTableRow
    }
  }
`);

const context: Partial<OperationContext> = {
  additionalTypenames: ["WorkStream"], // This lets urql know when to invalidate cache if request returns empty list. https://formidable.com/open-source/urql/docs/basics/document-caching/#document-cache-gotchas
  requestPolicy: "cache-first", // The list of workStream will rarely change, so we override default request policy to avoid unnecessary cache updates.
};

const WorkStreamTableApi = ({ title }: { title: string }) => {
  const [{ data, fetching, error }] = useQuery({
    query: WorkStreamTable_Query,
    context,
  });

  return (
    <Pending fetching={fetching} error={error}>
      <WorkStreamTable
        workStreamsQuery={unpackMaybes(data?.workStreams)}
        title={title}
      />
    </Pending>
  );
};

export default WorkStreamTableApi;
