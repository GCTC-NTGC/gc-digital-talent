import React, { useEffect, useMemo, useState } from "react";
import { IntlShape, useIntl } from "react-intl";
import { notEmpty } from "@common/helpers/util";
import { FromArray } from "@common/types/utilityTypes";
import {
  getJobLookingStatus,
  getLanguage,
  getPoolCandidateStatus,
  getProvinceOrTerritory,
} from "@common/constants/localizedConstants";
import Pending from "@common/components/Pending";
import { IdType } from "react-table";
import { LockClosedIcon } from "@heroicons/react/24/solid";
import {
  JobLookingStatus,
  Language,
  PoolCandidate,
  PoolCandidatePaginator,
  PoolCandidateStatus,
  ProvinceOrTerritory,
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
const statusAccessor = (
  status: PoolCandidateStatus | null | undefined,
  intl: IntlShape,
) => {
  if (status === PoolCandidateStatus.NewApplication) {
    return (
      <span data-h2-color="base(dt-accent)" data-h2-font-weight="base(700)">
        {status
          ? intl.formatMessage(getPoolCandidateStatus(status as string))
          : ""}
      </span>
    );
  }
  if (
    status === PoolCandidateStatus.ApplicationReview ||
    status === PoolCandidateStatus.ScreenedIn ||
    status === PoolCandidateStatus.ScreenedOutApplication ||
    status === PoolCandidateStatus.UnderAssessment ||
    status === PoolCandidateStatus.ScreenedOutAssessment
  ) {
    return (
      <span data-h2-font-weight="base(700)">
        {status
          ? intl.formatMessage(getPoolCandidateStatus(status as string))
          : ""}
      </span>
    );
  }
  return (
    <span>
      {status
        ? intl.formatMessage(getPoolCandidateStatus(status as string))
        : ""}
    </span>
  );
};
const priorityAccessor = (
  priority: number | null | undefined,
  intl: IntlShape,
) => {
  switch (priority) {
    case 10:
      return (
        <span data-h2-color="base(dt-primary)" data-h2-font-weight="base(700)">
          {intl.formatMessage({
            defaultMessage: "Priority Entitlement",
            description: "Priority text for users with priority entitlement",
          })}
        </span>
      );
    case 20:
      return (
        <span data-h2-color="base(dt-primary)" data-h2-font-weight="base(700)">
          {intl.formatMessage({
            defaultMessage: "Veteran",
            description: "Priority text for veterans",
          })}
        </span>
      );
    case 30:
      return (
        <span>
          {intl.formatMessage({
            defaultMessage: "Citizen or Resident",
            description: "Priority text for citizens of canada",
          })}
        </span>
      );
    default:
      return (
        <span>
          {intl.formatMessage({
            defaultMessage: "Work Visa",
            description: "Priority text for users with work visas",
          })}
        </span>
      );
  }
};
const availabilityAccessor = (
  status: JobLookingStatus | null | undefined,
  intl: IntlShape,
) => (
  <span>
    {status
      ? intl.formatMessage(getJobLookingStatus(status as string, "short"))
      : ""}
  </span>
);
const viewAccessor = (
  status: PoolCandidateStatus | null | undefined,
  intl: IntlShape,
) => (
  <span>
    {status === PoolCandidateStatus.NewApplication ||
    status === PoolCandidateStatus.ApplicationReview ||
    status === PoolCandidateStatus.ScreenedIn ||
    status === PoolCandidateStatus.ScreenedOutApplication ||
    status === PoolCandidateStatus.UnderAssessment ||
    status === PoolCandidateStatus.ScreenedOutAssessment
      ? intl.formatMessage({
          defaultMessage: "View Application",
          description:
            "Title displayed on the Pool Candidates table to view a users application.",
        })
      : intl.formatMessage({
          defaultMessage: "View Profile",
          description:
            "Title displayed on the Pool Candidates table to view a users profile.",
        })}
  </span>
);
const provinceAccessor = (
  province: ProvinceOrTerritory | null | undefined,
  intl: IntlShape,
) =>
  province
    ? intl.formatMessage(getProvinceOrTerritory(province as string))
    : "";

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
          defaultMessage: "Status",
          description:
            "Title displayed for the Pool Candidates table Status column.",
        }),
        header: (
          <span>
            {intl.formatMessage({
              defaultMessage: "Status",
              description:
                "Title displayed for the Pool Candidates table Status column.",
            })}
            <LockClosedIcon
              data-h2-margin="base(0, 0, 0, x1)"
              data-h2-width="base(x1)"
              data-h2-vertical-align="base(middle)"
            />
          </span>
        ),
        id: "status",
        accessor: (d) => statusAccessor(d.status, intl),
      },
      {
        label: intl.formatMessage({
          defaultMessage: "Priority",
          description:
            "Title displayed for the Pool Candidates table Priority column.",
        }),
        header: (
          <span>
            {intl.formatMessage({
              defaultMessage: "Priority",
              description:
                "Title displayed for the Pool Candidates table Priority column.",
            })}
            <LockClosedIcon
              data-h2-margin="base(0, 0, 0, x1)"
              data-h2-width="base(x1)"
              data-h2-vertical-align="base(middle)"
            />
          </span>
        ),
        id: "priority",
        accessor: ({ user }) => priorityAccessor(user.priorityWeight, intl),
      },
      {
        label: intl.formatMessage({
          defaultMessage: "Availability",
          description:
            "Title displayed for the Pool Candidates table Availability column.",
        }),
        id: "availability",
        accessor: ({ user }) =>
          availabilityAccessor(user.jobLookingStatus, intl),
      },
      {
        label: intl.formatMessage({
          defaultMessage: "View",
          description:
            "Title displayed for the Pool Candidates table View column.",
        }),
        id: "view",
        accessor: (d) => viewAccessor(d.status, intl),
      },
      {
        label: intl.formatMessage({
          defaultMessage: "Candidate Name",
          description:
            "Title displayed on the Pool Candidates table name column.",
        }),
        id: "candidateName",
        accessor: ({ user }) => `${user?.firstName} ${user?.lastName}`,
      },
      {
        label: intl.formatMessage({
          defaultMessage: "Email",
          description:
            "Title displayed for the Pool Candidates table Email column.",
        }),
        id: "email",
        accessor: ({ user }) => user?.email,
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
      {
        label: intl.formatMessage({
          defaultMessage: "Current Location",
          description:
            "Title displayed on the Pool Candidates table Current Location column.",
        }),
        id: "currentLocation",
        accessor: ({ user }) =>
          `${user?.currentCity}, ${provinceAccessor(
            user?.currentProvince,
            intl,
          )}`,
      },
      {
        label: intl.formatMessage({
          defaultMessage: "Date Received",
          description:
            "Title displayed on the Pool Candidates table Date Received column.",
        }),
        id: "dateReceived",
        accessor: (d) => d.submittedAt,
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
