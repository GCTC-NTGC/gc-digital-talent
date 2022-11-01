import React, { useMemo } from "react";
import { useIntl } from "react-intl";
import { Link, Pill } from "@common/components";
import { notEmpty } from "@common/helpers/util";
import { FromArray } from "@common/types/utilityTypes";
import { getLocale } from "@common/helpers/localize";
import { getOperationalRequirement } from "@common/constants/localizedConstants";
import Pending from "@common/components/Pending";
import { getFullNameLabel } from "@common/helpers/nameUtils";
import {
  SearchPoolCandidatesQuery,
  useSearchPoolCandidatesQuery,
  PoolCandidateFilterInput,
  ApplicantFilterInput,
  useSearchApplicantsQuery,
} from "../../api/generated";
import Table, { ColumnsOf } from "../Table";
import { useAdminRoutes } from "../../adminRoutes";

type Data = NonNullable<
  FromArray<SearchPoolCandidatesQuery["searchPoolCandidates"]>
>;

const TableEditButton: React.FC<{
  poolCandidateId?: string;
  poolId?: string;
  label?: string;
}> = ({ poolCandidateId, poolId, label }) => {
  const intl = useIntl();
  const paths = useAdminRoutes();
  return (
    <Link
      type="button"
      color="black"
      mode="inline"
      href={paths.poolCandidateUpdate(poolId || "", poolCandidateId || "")}
    >
      {intl.formatMessage(
        {
          defaultMessage: "Edit<hidden> {label}</hidden>",
          id: "i9ND/M",
          description: "Title displayed for the Edit column.",
        },
        { label },
      )}
    </Link>
  );
};

function tableEditButtonAccessor(
  poolCandidateId?: string,
  poolId?: string,
  label?: string,
) {
  return (
    <TableEditButton
      poolCandidateId={poolCandidateId}
      poolId={poolId}
      label={label}
    />
  );
}

export const SingleSearchRequestTable: React.FunctionComponent<
  SearchPoolCandidatesQuery
> = ({ searchPoolCandidates }) => {
  const intl = useIntl();
  const locale = getLocale(intl);

  const columns = useMemo<ColumnsOf<Data>>(
    () => [
      {
        Header: intl.formatMessage({
          defaultMessage: "Candidate ID",
          id: "1bNptz",
          description:
            "Title displayed on the single search request table id column.",
        }),
        accessor: "id",
      },
      {
        Header: intl.formatMessage({
          defaultMessage: "Candidate Name",
          id: "0PmIE8",
          description:
            "Title displayed on the single search request table candidate name column.",
        }),
        accessor: ({ user }) => `${user?.firstName} ${user?.lastName}`,
      },
      {
        Header: intl.formatMessage({
          defaultMessage: "Group and Level",
          id: "MmFgbF",
          description:
            "Title displayed on the single search request table classifications column.",
        }),
        accessor: ({ expectedClassifications }) =>
          expectedClassifications?.map((classification) => {
            return (
              <Pill
                key={`${classification?.group}-${classification?.level}`}
                color="secondary"
                mode="outline"
              >
                {`${classification?.group}-${classification?.level}`}
              </Pill>
            );
          }),
      },
      {
        Header: intl.formatMessage({
          defaultMessage: "Operational Requirements",
          id: "gN/+W2",
          description:
            "Title displayed on the single search request table operational requirements column.",
        }),
        accessor: ({ acceptedOperationalRequirements }) =>
          acceptedOperationalRequirements?.map((operationalRequirement) => {
            return (
              <Pill key={operationalRequirement} color="primary" mode="outline">
                {intl.formatMessage(
                  operationalRequirement
                    ? getOperationalRequirement(operationalRequirement)
                    : {
                        defaultMessage: "Error: Name not found.",
                        description:
                          "Error message displayed on the single search request table operational requirements column.",
                      },
                )}
              </Pill>
            );
          }),
      },
      {
        Header: intl.formatMessage({
          defaultMessage: "Employment Equity",
          id: "i45Vxz",
          description:
            "Title displayed on the single search request table employment equity column.",
        }),
        accessor: ({
          isIndigenous,
          isVisibleMinority,
          isWoman,
          hasDisability,
        }) => {
          const employmentEquity = [
            ...(isWoman
              ? [
                  intl.formatMessage({
                    defaultMessage: "Woman",
                    id: "VaCRxh",
                    description:
                      "Message for woman option in the employment equity column on the the single search request table.",
                  }),
                ]
              : []),
            ...(isVisibleMinority
              ? [
                  intl.formatMessage({
                    defaultMessage: "Visible Minority",
                    id: "UdZaOq",
                    description:
                      "Message for visible minority option in the employment equity column on the the single search request table.",
                  }),
                ]
              : []),
            ...(isIndigenous
              ? [
                  intl.formatMessage({
                    defaultMessage: "Indigenous",
                    id: "JtgX1e",
                    description:
                      "Message for indigenous option in the employment equity column on the the single search request table.",
                  }),
                ]
              : []),
            ...(hasDisability
              ? [
                  intl.formatMessage({
                    defaultMessage: "Disability",
                    id: "97LfRf",
                    description:
                      "Message for disability option in the employment equity column on the the single search request table.",
                  }),
                ]
              : []),
          ];
          return employmentEquity?.map((option) => {
            return (
              <Pill key={option} color="secondary" mode="outline">
                {option ||
                  intl.formatMessage({
                    defaultMessage: "Error: Name not found.",
                    id: "c9jMPS",
                    description:
                      "Error message displayed on the single search request table employment equity column.",
                  })}
              </Pill>
            );
          });
        },
      },
      {
        Header: intl.formatMessage({
          defaultMessage: "Skills",
          id: "i9/L40",
          description:
            "Title displayed on the single search request table skills column.",
        }),
        accessor: ({ cmoAssets }) =>
          cmoAssets?.map((cmoAsset) => {
            return (
              <Pill key={cmoAsset?.key} color="primary" mode="outline">
                {cmoAsset?.name?.[locale] ||
                  intl.formatMessage({
                    defaultMessage: "Error: Name not found.",
                    id: "ZP3GYM",
                    description:
                      "Error message displayed on the single search request table operational requirements column.",
                  })}
              </Pill>
            );
          }),
      },
      {
        Header: intl.formatMessage({
          defaultMessage: "Edit",
          id: "lo2bSB",
          description:
            "Title displayed for the single search request table edit column.",
        }),
        accessor: ({ id, pool, user }) =>
          tableEditButtonAccessor(
            id,
            pool?.id,
            getFullNameLabel(user.firstName, user.lastName, intl),
          ),
      },
    ],
    [intl, locale],
  );

  const memoizedData = useMemo(
    () => searchPoolCandidates.filter(notEmpty),
    [searchPoolCandidates],
  );

  return <Table data={memoizedData} columns={columns} />;
};

type AbstractFilterInput = PoolCandidateFilterInput | ApplicantFilterInput;

function checkIsLegacyFilter(
  filterInput: AbstractFilterInput,
): filterInput is PoolCandidateFilterInput {
  if ("cmoAssets" in filterInput) return true;

  return false;
}

function useSearchQuery(filterInput: AbstractFilterInput) {
  const isLegacyFilter = checkIsLegacyFilter(filterInput);
  // See: https://formidable.com/open-source/urql/docs/basics/react-preact/#pausing-usequery
  const [legacyResult] = useSearchPoolCandidatesQuery({
    variables: { poolCandidateFilter: filterInput },
    pause: !isLegacyFilter,
  });
  const [result] = useSearchApplicantsQuery({
    variables: { applicantFilter: filterInput },
    pause: isLegacyFilter,
  });

  return { legacyResult, result };
}

export const SingleSearchRequestTableApi: React.FunctionComponent<{
  filterInput: AbstractFilterInput;
}> = ({ filterInput }) => {
  const isLegacyFilter = checkIsLegacyFilter(filterInput);
  const { legacyResult, result } = useSearchQuery(filterInput);

  return isLegacyFilter ? (
    <Pending fetching={legacyResult.fetching} error={legacyResult.error}>
      <SingleSearchRequestTable
        searchPoolCandidates={legacyResult.data?.searchPoolCandidates ?? []}
      />
    </Pending>
  ) : (
    <div>should not render</div>
  );
};
