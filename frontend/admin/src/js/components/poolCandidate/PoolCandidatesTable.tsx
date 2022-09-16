import React, { useEffect, useMemo, useRef, useState } from "react";
import { IntlShape, useIntl } from "react-intl";
import { notEmpty } from "@common/helpers/util";
import { FromArray } from "@common/types/utilityTypes";
import {
  getJobLookingStatus,
  getLanguage,
  getPoolCandidatePriorities,
  getPoolCandidateStatus,
  getProvinceOrTerritory,
} from "@common/constants/localizedConstants";
import Pending from "@common/components/Pending";
import { IdType } from "react-table";
import { LockClosedIcon } from "@heroicons/react/24/solid";
import { Link } from "@common/components";
import { useReactToPrint } from "react-to-print";
import printStyles from "@common/constants/printStyles";
import {
  JobLookingStatus,
  Language,
  PoolCandidate,
  PoolCandidatePaginator,
  PoolCandidateStatus,
  ProvinceOrTerritory,
  useGetPoolCandidatesPaginatedQuery,
  useGetSelectedPoolCandidatesQuery,
} from "../../api/generated";
import TableHeader from "../apiManagedTable/TableHeader";
import { useAdminRoutes } from "../../adminRoutes";
import {
  ColumnsOf,
  handleColumnHiddenChange,
  handleRowSelectedChange,
  rowSelectionColumn,
} from "../apiManagedTable/basicTableHelpers";
import BasicTable from "../apiManagedTable/BasicTable";
import TableFooter from "../apiManagedTable/TableFooter";
import usePoolCandidateCsvData from "./usePoolCandidateCsvData";
import PoolCandidateDocument from "./PoolCandidateDocument";

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
  if (priority === 10 || priority === 20) {
    return (
      <span data-h2-color="base(dt-primary)" data-h2-font-weight="base(700)">
        {priority
          ? intl.formatMessage(getPoolCandidatePriorities(priority))
          : ""}
      </span>
    );
  }
  return (
    <span>
      {priority ? intl.formatMessage(getPoolCandidatePriorities(priority)) : ""}
    </span>
  );
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
const viewAccessor = (url: string, isQualified: boolean, intl: IntlShape) => {
  return (
    <span data-h2-font-weight="base(700)">
      <Link
        href={url}
        title={
          isQualified
            ? intl.formatMessage({
                defaultMessage: "Link to candidate application",
                id: "NtIQ4g",
                description:
                  "Descriptive title for anchor link to candidates application",
              })
            : intl.formatMessage({
                defaultMessage: "Link to candidate profile",
                id: "head8A",
                description:
                  "Descriptive title for anchor link to candidates profile",
              })
        }
      >
        {isQualified
          ? intl.formatMessage({
              defaultMessage: "View Application",
              id: "7zcW68",
              description:
                "Title displayed on the Pool Candidates table to view a users application.",
            })
          : intl.formatMessage({
              defaultMessage: "View Profile",
              id: "09n0oh",
              description:
                "Title displayed on the Pool Candidates table to view a users profile.",
            })}
      </Link>
    </span>
  );
};
const provinceAccessor = (
  province: ProvinceOrTerritory | null | undefined,
  intl: IntlShape,
) =>
  province
    ? intl.formatMessage(getProvinceOrTerritory(province as string))
    : "";

const PoolCandidatesTable: React.FC<{ poolId: string }> = ({ poolId }) => {
  const intl = useIntl();
  const paths = useAdminRoutes();

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [hiddenColumnIds, setHiddenColumnIds] = useState<IdType<Data>[]>([]);
  const [selectedRows, setSelectedRows] = useState<PoolCandidate[]>([]);

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
      rowSelectionColumn(
        intl,
        selectedRows,
        filteredData.length,
        (candidate: Data) =>
          `${candidate.user.firstName} ${candidate.user.lastName}`,
        (event) =>
          handleRowSelectedChange(
            filteredData,
            selectedRows,
            setSelectedRows,
            event,
          ),
      ),
      {
        label: intl.formatMessage({
          defaultMessage: "Status",
          id: "l+cu8R",
          description:
            "Title displayed for the Pool Candidates table Status column.",
        }),
        header: (
          <span>
            {intl.formatMessage({
              defaultMessage: "Status",
              id: "l+cu8R",
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
          id: "EZQ9Dj",
          description:
            "Title displayed for the Pool Candidates table Priority column.",
        }),
        header: (
          <span>
            {intl.formatMessage({
              defaultMessage: "Priority",
              id: "EZQ9Dj",
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
          id: "fLSDYW",
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
          id: "VhBuJ/",
          description:
            "Title displayed for the Pool Candidates table View column.",
        }),
        id: "view",
        accessor: (d) => {
          const isQualified =
            d.status !== PoolCandidateStatus.NewApplication &&
            d.status !== PoolCandidateStatus.ApplicationReview &&
            d.status !== PoolCandidateStatus.ScreenedIn &&
            d.status !== PoolCandidateStatus.ScreenedOutApplication &&
            d.status !== PoolCandidateStatus.UnderAssessment &&
            d.status !== PoolCandidateStatus.ScreenedOutAssessment;

          // TODO: Update this to navigate to application if applicant not qualified
          return viewAccessor(paths.userView(d.user.id), isQualified, intl);
        },
      },
      {
        label: intl.formatMessage({
          defaultMessage: "Candidate Name",
          id: "p/Qp/u",
          description:
            "Title displayed on the Pool Candidates table name column.",
        }),
        id: "candidateName",
        accessor: ({ user }) => `${user?.firstName} ${user?.lastName}`,
      },
      {
        label: intl.formatMessage({
          defaultMessage: "Email",
          id: "BSVnmg",
          description:
            "Title displayed for the Pool Candidates table Email column.",
        }),
        id: "email",
        accessor: ({ user }) => user?.email,
      },
      {
        label: intl.formatMessage({
          defaultMessage: "Preferred Language",
          id: "dTJkNA",
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
          id: "1sPszf",
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
          id: "3eNQnt",
          description:
            "Title displayed on the Pool Candidates table Date Received column.",
        }),
        id: "dateReceived",
        accessor: (d) => d.submittedAt,
      },
    ],
    [intl, selectedRows, filteredData, paths],
  );

  const allColumnIds = columns.map((c) => c.id);

  const selectedCandidateIds = selectedRows.map((user) => user.id);
  const [
    {
      data: selectedCandidatesData,
      fetching: selectedCandidatesFetching,
      error: selectedCandidatesError,
    },
  ] = useGetSelectedPoolCandidatesQuery({
    variables: {
      ids: selectedCandidateIds,
    },
  });

  const componentRef = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    pageStyle: printStyles,
    documentTitle: "Candidate Profiles",
  });
  const selectedCandidates =
    selectedCandidatesData?.poolCandidates.filter(notEmpty) ?? [];

  const csv = usePoolCandidateCsvData(selectedCandidates);

  return (
    <div data-h2-margin="base(x1, 0)">
      <h2 id="user-table-heading" data-h2-visibility="base(invisible)">
        {intl.formatMessage({
          defaultMessage: "All Users",
          id: "VlI1K4",
          description: "Title for the admin users table",
        })}
      </h2>
      <TableHeader
        columns={columns}
        onFilterChange={() => {
          /* TODO: Implement this later */
        }}
        onSearchChange={() => {
          /* TODO: Implement this later */
        }}
        addBtn={{
          label: intl.formatMessage({
            defaultMessage: "Create Pool Candidate",
            id: "Ox+Gj/",
            description:
              "Text label for link to create new pool candidate on admin table",
          }),
          path: paths.userCreate(),
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
              /* Implement this later if desired */
            }}
          />
        </Pending>
        <TableFooter
          paginatorInfo={data?.poolCandidatesPaginated?.paginatorInfo}
          onCurrentPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
          hasSelection
          onPrint={handlePrint}
          fetchingSelected={selectedCandidatesFetching}
          selectionError={selectedCandidatesError}
          disableActions={
            selectedCandidatesFetching ||
            !!selectedCandidatesError ||
            !selectedCandidatesData?.poolCandidates.length
          }
          csv={{
            ...csv,
            fileName: intl.formatMessage(
              {
                defaultMessage: "pool_candidates_{date}.csv",
                id: "aWsXoR",
                description: "Filename for pool candidate CSV file download",
              },
              {
                date: new Date().toISOString(),
              },
            ),
          }}
        />
        <PoolCandidateDocument
          candidates={selectedCandidates}
          ref={componentRef}
        />
      </div>
    </div>
  );
};

export default PoolCandidatesTable;
