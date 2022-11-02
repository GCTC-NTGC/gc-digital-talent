import React, { useMemo } from "react";
import { useIntl } from "react-intl";
import { Link, Pill } from "@common/components";
import { empty, identity, notEmpty } from "@common/helpers/util";
import { FromArray } from "@common/types/utilityTypes";
import { getLocale } from "@common/helpers/localize";
import { getOperationalRequirement } from "@common/constants/localizedConstants";
import Pending from "@common/components/Pending";
import { getFullNameLabel } from "@common/helpers/nameUtils";
import { omit, pick } from "lodash";
import {
  SearchPoolCandidatesQuery,
  useSearchPoolCandidatesQuery,
  PoolCandidateFilterInput,
  ApplicantFilterInput,
  useSearchApplicantsQuery,
  PoolCandidateFilter,
  ApplicantFilter,
  UserFilterInput,
  IdInput,
  Maybe,
  Classification,
  Pool,
  Skill,
} from "../../api/generated";
import Table, { ColumnsOf } from "../Table";
import { useAdminRoutes } from "../../adminRoutes";
import UserTable from "../user/UserTable";

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

export type AbstractFilter = PoolCandidateFilter | ApplicantFilter;

export function checkIsLegacyFilter(
  filter: AbstractFilter,
): filter is PoolCandidateFilter {
  // eslint-disable-next-line no-underscore-dangle
  if (filter.__typename === "PoolCandidateFilter") return true;

  return false;
}

// function useSearchQuery(filterInput: AbstractFilterInput) {
//   const isLegacyFilter = checkIsLegacyFilter(filterInput);
//   // See: https://formidable.com/open-source/urql/docs/basics/react-preact/#pausing-usequery
//   const [legacyResult] = useSearchPoolCandidatesQuery({
//     variables: { poolCandidateFilter: filterInput },
//     pause: !isLegacyFilter,
//   });
//   const [result] = useSearchApplicantsQuery({
//     variables: { applicantFilter: filterInput },
//     pause: isLegacyFilter,
//   });

//   return { legacyResult, result };
// }

// function transformApplicantToUserFilterInput(applicantFilterInput: )

const transformFilterToInput = (
  inputFilter: PoolCandidateFilter,
): PoolCandidateFilterInput => {
  return {
    expectedClassifications: [
      ...(inputFilter?.classifications
        ? inputFilter.classifications
            .filter(notEmpty)
            .map(({ group, level }) => {
              return {
                group,
                level,
              };
            })
        : []),
    ],
    cmoAssets: [
      ...(inputFilter?.cmoAssets
        ? inputFilter.cmoAssets.filter(notEmpty).map(({ key }) => {
            return {
              key,
            };
          })
        : []),
    ],
    operationalRequirements: inputFilter?.operationalRequirements,
    pools: [
      ...(inputFilter?.pools
        ? inputFilter.pools.filter(notEmpty).map(({ id }) => {
            return {
              id,
            };
          })
        : []),
    ],
    hasDiploma: inputFilter?.hasDiploma,
    equity: {
      hasDisability: inputFilter?.equity?.hasDisability,
      isIndigenous: inputFilter?.equity?.isIndigenous,
      isVisibleMinority: inputFilter?.equity?.isVisibleMinority,
      isWoman: inputFilter?.equity?.isWoman,
    },
    languageAbility: inputFilter?.languageAbility || undefined,
    locationPreferences: inputFilter?.workRegions,
  };
};

function omitIdAndTypename<T extends object | null | undefined>(
  x: T,
): Omit<T, "id" | "__typename"> {
  return omit(x, ["id", "__typename"]) as Omit<T, "id" | "__typename">;
}

function pickId<T extends IdInput>(x: T): IdInput {
  return pick(x, ["id"]);
}

const transformApplicantFilterToApplicantFilterInput = (
  applicantFilter: ApplicantFilter,
): ApplicantFilterInput => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const idInputs = ["pools", "skills"];

  const mapping: Record<keyof ApplicantFilterInput, (x: any) => any> = {
    equity: omitIdAndTypename,
    expectedClassifications: (c: Classification) => pick(c, ["group", "level"]),
    hasDiploma: identity,
    languageAbility: identity,
    locationPreferences: identity,
    operationalRequirements: identity,
    pools: (x: Array<Maybe<Pool>>) => x.filter(notEmpty).map(pickId),
    skills: (x: Array<Maybe<Skill>>) => x.filter(notEmpty).map(pickId),
    wouldAcceptTemporary: identity,
  };

  return Object.entries(mapping).reduce(
    (applicantFilterInput: ApplicantFilterInput, filterEntry) => {
      const [key, transform] = filterEntry;
      const originalValue = applicantFilter[key as keyof ApplicantFilterInput];
      if (notEmpty(originalValue)) {
        applicantFilterInput[key as keyof ApplicantFilterInput] =
          transform(originalValue);
      }
      return applicantFilterInput;
    },
    {},
  );
};

const transformApplicantFilterToUserFilterInput = (
  applicantFilter: ApplicantFilter,
): UserFilterInput => {
  const applicantFilterInput =
    transformApplicantFilterToApplicantFilterInput(applicantFilter);
  return {
    applicantFilter: applicantFilterInput,
  };
};

export const SingleSearchRequestTableApi: React.FunctionComponent<{
  filter: AbstractFilter;
}> = ({ filter }) => {
  const isLegacyFilter = checkIsLegacyFilter(filter);

  const poolCandidateFilterInput = isLegacyFilter
    ? transformFilterToInput(filter)
    : undefined;
  const [legacyResult] = useSearchPoolCandidatesQuery({
    variables: { poolCandidateFilter: poolCandidateFilterInput },
    pause: !isLegacyFilter,
  });
  const userFilterInput = !isLegacyFilter
    ? transformApplicantFilterToUserFilterInput(filter)
    : undefined;

  return isLegacyFilter ? (
    <Pending fetching={legacyResult.fetching} error={legacyResult.error}>
      <SingleSearchRequestTable
        searchPoolCandidates={legacyResult.data?.searchPoolCandidates ?? []}
      />
    </Pending>
  ) : (
    <UserTable initialFilterInput={userFilterInput} />
  );
};
