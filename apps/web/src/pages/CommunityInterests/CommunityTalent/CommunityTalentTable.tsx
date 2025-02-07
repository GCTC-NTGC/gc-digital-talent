import { useState } from "react";
import {
  ColumnDef,
  PaginationState,
  SortingState,
  createColumnHelper,
} from "@tanstack/react-table";
import { useIntl } from "react-intl";
import { useQuery } from "urql";

import { notEmpty } from "@gc-digital-talent/helpers";
import {
  graphql,
  CommunityTalentTableQuery as CommunityTalentTableQueryType,
} from "@gc-digital-talent/graphql";

import Table from "~/components/Table/ResponsiveTable/ResponsiveTable";
import { INITIAL_STATE } from "~/components/Table/ResponsiveTable/constants";

import { transformSortStateToOrderByClause } from "./utils";

const CommunityTalentTable_Query = graphql(/* GraphQL */ `
  query CommunityTalentTable(
    $where: CommunityInterestFilterInput
    $first: Int
    $page: Int
    $orderBy: [OrderByClause!]
  ) {
    communityInterestsPaginated(
      where: $where
      first: $first
      page: $page
      orderBy: $orderBy
    ) {
      data {
        id
      }
      paginatorInfo {
        count
        currentPage
        firstItem
        hasMorePages
        lastItem
        lastPage
        perPage
        total
      }
    }
  }
`);

type CommunityTalentTableQueryCommunityInterestType =
  CommunityTalentTableQueryType["communityInterestsPaginated"]["data"][number];

const columnHelper =
  createColumnHelper<CommunityTalentTableQueryCommunityInterestType>();

const sortInitialState = [
  {
    id: "id",
    desc: true,
  },
];

interface CommunityTalentTableProps {
  title: string;
}

const CommunityTalentTable = ({ title }: CommunityTalentTableProps) => {
  const intl = useIntl();

  const [paginationState, setPaginationState] = useState<PaginationState>(
    INITIAL_STATE.paginationState,
  );
  const [sortState, setSortState] = useState<SortingState | undefined>(
    sortInitialState,
  );

  const handlePaginationStateChange = ({
    pageIndex,
    pageSize,
  }: PaginationState) => {
    setPaginationState((previous) => ({
      pageIndex:
        previous.pageSize === pageSize
          ? (pageIndex ?? INITIAL_STATE.paginationState.pageIndex)
          : 0,
      pageSize: pageSize ?? INITIAL_STATE.paginationState.pageSize,
    }));
  };

  const [{ data, fetching }] = useQuery({
    query: CommunityTalentTable_Query,
    variables: {
      where: undefined,
      page: paginationState.pageIndex,
      first: paginationState.pageSize,
      orderBy: sortState
        ? transformSortStateToOrderByClause(sortState)
        : undefined,
    },
  });

  const communityInterestData =
    data?.communityInterestsPaginated?.data.filter(notEmpty) ?? [];

  const columns = [
    columnHelper.accessor("id", {
      id: "id",
      header: intl.formatMessage({
        defaultMessage: "Id",
        id: "CFsPDG",
        description: "aaa",
      }),
    }),
  ] as ColumnDef<CommunityTalentTableQueryCommunityInterestType>[];

  return (
    <Table<CommunityTalentTableQueryCommunityInterestType>
      data={communityInterestData}
      caption={title}
      columns={columns}
      hiddenColumnIds={[]}
      isLoading={fetching}
      sort={{
        internal: false,
        onSortChange: setSortState,
        initialState: sortInitialState,
      }}
      pagination={{
        internal: false,
        initialState: INITIAL_STATE.paginationState,
        state: paginationState,
        total: data?.communityInterestsPaginated.paginatorInfo.total,
        pageSizes: [10, 20, 50],
        onPaginationChange: ({ pageIndex, pageSize }: PaginationState) => {
          handlePaginationStateChange({ pageIndex, pageSize });
        },
      }}
    />
  );
};

export default CommunityTalentTable;
