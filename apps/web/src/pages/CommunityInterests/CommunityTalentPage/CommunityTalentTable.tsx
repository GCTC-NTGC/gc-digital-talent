import { useMemo, useState } from "react";
import {
  ColumnDef,
  PaginationState,
  SortingState,
  createColumnHelper,
} from "@tanstack/react-table";
import { useIntl } from "react-intl";
import { useQuery } from "urql";

import { unpackMaybes } from "@gc-digital-talent/helpers";
import {
  graphql,
  CommunityTalentTableCommunityInterestFragment as CommunityTalentTableCommunityInterestFragmentType,
  getFragment,
} from "@gc-digital-talent/graphql";
import { commonMessages } from "@gc-digital-talent/i18n";

import Table from "~/components/Table/ResponsiveTable/ResponsiveTable";
import { INITIAL_STATE } from "~/components/Table/ResponsiveTable/constants";
import { getFullNameLabel } from "~/utils/nameUtils";
import useRoutes from "~/hooks/useRoutes";
import cells from "~/components/Table/cells";
import adminMessages from "~/messages/adminMessages";
import processMessages from "~/messages/processMessages";

import {
  classificationAccessor,
  interestAccessor,
  transformSortStateToOrderByClause,
  usernameCell,
} from "./utils";

const CommunityTalentTable_CommunityInterestFragment = graphql(/* GraphQL */ `
  fragment CommunityTalentTableCommunityInterest on CommunityInterest {
    id
    jobInterest
    trainingInterest
    user {
      id
      firstName
      lastName
      workEmail
      preferredLang {
        label {
          localized
        }
      }
      lookingForEnglish
      lookingForFrench
      lookingForBilingual
      currentClassification {
        group
        level
      }
    }
    community {
      name {
        localized
      }
    }
  }
`);

const CommunityTalentTable_Query = graphql(/* GraphQL */ `
  query CommunityTalentTable(
    $where: CommunityInterestFilterInput
    $first: Int
    $page: Int
    $orderBy: [QueryCommunityInterestsPaginatedOrderByRelationOrderByClause!]
  ) {
    communityInterestsPaginated(
      where: $where
      first: $first
      page: $page
      orderBy: $orderBy
    ) {
      data {
        ...CommunityTalentTableCommunityInterest
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

const columnHelper =
  createColumnHelper<CommunityTalentTableCommunityInterestFragmentType>();

interface CommunityTalentTableProps {
  title: string;
}

const CommunityTalentTable = ({ title }: CommunityTalentTableProps) => {
  const intl = useIntl();
  const paths = useRoutes();

  const [paginationState, setPaginationState] = useState<PaginationState>(
    INITIAL_STATE.paginationState,
  );
  const [sortState, setSortState] = useState<SortingState>([]);

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
      orderBy: [transformSortStateToOrderByClause(sortState)],
    },
  });

  const dataFragment = getFragment(
    CommunityTalentTable_CommunityInterestFragment,
    data?.communityInterestsPaginated?.data,
  );
  const communityInterestData = useMemo(
    () => unpackMaybes(dataFragment),
    [dataFragment],
  );

  const columns = [
    columnHelper.accessor(
      ({ user }) => getFullNameLabel(user.firstName, user.lastName, intl),
      {
        id: "userName",
        header: intl.formatMessage(commonMessages.name),
        enableColumnFilter: false,
        cell: ({
          row: {
            original: { user },
          },
        }) => usernameCell(user.id, paths, intl, user.firstName, user.lastName),
        meta: {
          isRowTitle: true,
        },
      },
    ),
    columnHelper.accessor(({ community }) => community.name?.localized, {
      id: "community",
      header: intl.formatMessage(adminMessages.community),
      enableColumnFilter: false,
      enableSorting: false,
    }),
    columnHelper.accessor(
      ({
        user: { lookingForEnglish, lookingForFrench, lookingForBilingual },
      }) => {
        const arr = [];
        if (lookingForEnglish) {
          arr.push(intl.formatMessage(commonMessages.english));
        }
        if (lookingForFrench) {
          arr.push(intl.formatMessage(commonMessages.french));
        }
        if (lookingForBilingual) {
          arr.push(intl.formatMessage(commonMessages.bilingualEnglishFrench));
        }
        return arr.join(", ");
      },
      {
        id: "languageAbility",
        header: intl.formatMessage(commonMessages.workingLanguageAbility),
        enableColumnFilter: false,
        enableSorting: false,
      },
    ),
    columnHelper.accessor(
      ({ user: { currentClassification } }) =>
        classificationAccessor(
          currentClassification?.group,
          currentClassification?.level,
        ),
      {
        id: "classification",
        header: intl.formatMessage(processMessages.classification),
        enableColumnFilter: false,
        enableSorting: false,
      },
    ),
    columnHelper.accessor(({ user }) => user?.workEmail, {
      id: "workEmail",
      header: intl.formatMessage(commonMessages.workEmail),
      enableColumnFilter: false,
      cell: ({ getValue }) => cells.email(getValue()),
    }),
    columnHelper.accessor(
      ({ jobInterest }) => interestAccessor(intl, jobInterest),
      {
        id: "jobInterest",
        header: intl.formatMessage(commonMessages.jobInterest),
        enableColumnFilter: false,
      },
    ),
    columnHelper.accessor(
      ({ trainingInterest }) => interestAccessor(intl, trainingInterest),
      {
        id: "trainingInterest",
        header: intl.formatMessage(commonMessages.trainingInterest),
        enableColumnFilter: false,
      },
    ),
    columnHelper.accessor(
      ({ user: { preferredLang } }) => preferredLang?.label?.localized,
      {
        id: "preferredLang",
        enableColumnFilter: false,
        header: intl.formatMessage(
          commonMessages.preferredCommunicationLanguage,
        ),
      },
    ),
  ] as ColumnDef<CommunityTalentTableCommunityInterestFragmentType>[];

  return (
    <Table<CommunityTalentTableCommunityInterestFragmentType>
      data={communityInterestData}
      caption={title}
      columns={columns}
      hiddenColumnIds={["community", "workEmail", "preferredLang"]}
      isLoading={fetching}
      sort={{
        internal: false,
        onSortChange: setSortState,
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
