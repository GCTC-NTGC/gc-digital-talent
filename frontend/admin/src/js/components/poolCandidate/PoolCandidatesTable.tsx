import React, { useEffect, useMemo, useState } from "react";
import { IntlShape, useIntl } from "react-intl";
import { notEmpty } from "@common/helpers/util";
import { FromArray } from "@common/types/utilityTypes";
import { getLocale } from "@common/helpers/localize";
import { getLanguage } from "@common/constants/localizedConstants";
import Pending from "@common/components/Pending";
import { IdType } from "react-table";
import {
  Language,
  PoolCandidate,
  PoolCandidatePaginator,
  useGetPoolCandidatesPaginatedQuery,
} from "../../api/generated";
import TableHeader from "../apiManagedTable/TableHeader";
import {
  ColumnsOf,
  handleColumnHiddenChange,
} from "../apiManagedTable/basicTableHelpers";
import BasicTable from "../apiManagedTable/BasicTable";
import TableFooter from "../apiManagedTable/TableFooter";

type Data = NonNullable<FromArray<PoolCandidatePaginator["data"]>>;

// callbacks extracted to separate function to stabilize memoized component
const preferredLanguageAccessor = (
  language: Language | null | undefined,
  intl: IntlShape,
) => (
  <span>
    {language ? intl.formatMessage(getLanguage(language as string)) : ""}
  </span>
);

const PoolCandidatesTable: React.FC<{ poolId: string }> = ({ poolId }) => {
  const intl = useIntl();

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [hiddenColumnIds, setHiddenColumnIds] = useState<IdType<Data>[]>([]);
  const [selectedRows, setSelectedRows] = useState<PoolCandidate[]>([]);
  /* const [searchState, setSearchState] = useState<{  --- TODO: Re-add this with functionality for text search
    term: string | undefined;
    col: string | undefined;
  }>();


  const searchStateToFilterInput = (
    val: string | undefined,
    col: string | undefined,
  ): InputMaybe<UserFilterInput> => {
    if (!val) return undefined;

    return {
      generalSearch: val && !col ? val : undefined,
      email: col === "email" ? val : undefined,
      name: col === "name" ? val : undefined,
      telephone: col === "phone" ? val : undefined,
    };
  }; */

  useEffect(() => {
    setSelectedRows([]);
  }, [currentPage, pageSize]);

  const [result] = useGetPoolCandidatesPaginatedQuery({
    variables: {
      where: { pools: [{ id: poolId }] },
      page: currentPage,
      first: pageSize,
    },
  });

  const { data, fetching, error } = result;

  const candidateData = data?.poolCandidatesPaginated?.data ?? [];
  const filteredData = candidateData.filter(notEmpty);

  const columns = useMemo<ColumnsOf<Data>>(
    () => [
      {
        label: intl.formatMessage({
          defaultMessage: "Pool",
          description:
            "Title displayed for the Pool Candidates table Pool column.",
        }),
        id: "poolName",
        accessor: (d) => d.pool?.name?.[getLocale(intl)],
      },
      {
        label: intl.formatMessage({
          defaultMessage: "User",
          description:
            "Title displayed for the Pool Candidates table User column.",
        }),
        id: "user",
        accessor: (d) => d.user?.email,
      },
      {
        label: intl.formatMessage({
          defaultMessage: "Name",
          description:
            "Title displayed on the Pool Candidates table name column.",
        }),
        id: "candidateName",
        accessor: ({ user }) => `${user?.firstName} ${user?.lastName}`,
      },
      {
        label: intl.formatMessage({
          defaultMessage: "Preferred Language",
          description:
            "Title displayed on the Pool Candidates table Preferred Lang column.",
        }),
        id: "preferredLang",
        accessor: ({ user }) =>
          preferredLanguageAccessor(user?.preferredLang, intl),
      },
    ],
    [intl],
  );

  const allColumnIds = columns.map((c) => c.id);

  /* const selectedApplicantIds = selectedRows.map((user) => user.id);
  const [
    {
      data: selectedUsersData,
      fetching: selectedUsersFetching,
      error: selectedUsersError,
    },
  ] = useSelectedUsersQuery({
    variables: {
      ids: selectedApplicantIds,
    },
  });

  const componentRef = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    pageStyle: printStyles,
    documentTitle: "Candidate Profiles",
  });
  const selectedApplicants =
    selectedUsersData?.applicants.filter(notEmpty) ?? [];

  const csv = useUserCsvData(selectedApplicants); */

  return (
    <div data-h2-margin="base(x1, 0)">
      <h2 id="user-table-heading" data-h2-visibility="base(invisible)">
        {intl.formatMessage({
          defaultMessage: "All Users",
          description: "Title for the admin users table",
        })}
      </h2>
      <TableHeader
        columns={columns}
        onSearchChange={() => {
          /* TODO: Implement this later */
        }}
        onColumnHiddenChange={(event) =>
          handleColumnHiddenChange(
            allColumnIds,
            hiddenColumnIds,
            setHiddenColumnIds,
            event,
          )
        }
        hiddenColumnIds={hiddenColumnIds}
      />
      <div data-h2-radius="base(s)">
        <Pending fetching={fetching} error={error} inline>
          <BasicTable
            labelledBy="pool-candidate-table-heading"
            data={filteredData}
            columns={columns}
            hiddenColumnIds={hiddenColumnIds}
            onSortingRuleChange={() => {
              /* TODO: Implement this later */
            }}
          />
        </Pending>
        <TableFooter
          paginatorInfo={data?.poolCandidatesPaginated?.paginatorInfo}
          onCurrentPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
          hasSelection
        />
      </div>
    </div>
  );
};

export default PoolCandidatesTable;
