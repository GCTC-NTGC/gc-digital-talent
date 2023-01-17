import React, { useMemo } from "react";
import { useIntl } from "react-intl";
import { Link, Pill } from "@common/components";
import { identity, notEmpty } from "@common/helpers/util";
import { FromArray } from "@common/types/utilityTypes";
import { getOperationalRequirement } from "@common/constants/localizedConstants";
import Pending from "@common/components/Pending";
import { getFullNameLabel } from "@common/helpers/nameUtils";
import omit from "lodash/omit";
import pick from "lodash/pick";
import {
  SearchPoolCandidatesQuery,
  useSearchPoolCandidatesQuery,
  PoolCandidateFilterInput,
  ApplicantFilterInput,
  PoolCandidateFilter,
  ApplicantFilter,
  IdInput,
  Classification,
  ClassificationFilterInput,
  PoolCandidateSearchInput,
  PoolCandidateStatus,
} from "../../api/generated";
import Table, { ColumnsOf } from "../Table";
import { useAdminRoutes } from "../../adminRoutes";
import PoolCandidatesTable from "../poolCandidate/PoolCandidatesTable";

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
        accessor: ({ user }) =>
          user.expectedClassifications?.map((classification) => {
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
        accessor: ({ user }) =>
          user.acceptedOperationalRequirements?.map(
            (operationalRequirement) => {
              return (
                <Pill
                  key={operationalRequirement}
                  color="primary"
                  mode="outline"
                >
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
            },
          ),
      },
      {
        Header: intl.formatMessage({
          defaultMessage: "Employment Equity",
          id: "i45Vxz",
          description:
            "Title displayed on the single search request table employment equity column.",
        }),
        accessor: ({ user }) => {
          const employmentEquity = [
            ...(user.isWoman
              ? [
                  intl.formatMessage({
                    defaultMessage: "Woman",
                    id: "VaCRxh",
                    description:
                      "Message for woman option in the employment equity column on the the single search request table.",
                  }),
                ]
              : []),
            ...(user.isVisibleMinority
              ? [
                  intl.formatMessage({
                    defaultMessage: "Visible Minority",
                    id: "UdZaOq",
                    description:
                      "Message for visible minority option in the employment equity column on the the single search request table.",
                  }),
                ]
              : []),
            ...(user.isIndigenous
              ? [
                  intl.formatMessage({
                    defaultMessage: "Indigenous",
                    id: "JtgX1e",
                    description:
                      "Message for indigenous option in the employment equity column on the the single search request table.",
                  }),
                ]
              : []),
            ...(user.hasDisability
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
    [intl],
  );

  const memoizedData = useMemo(
    () => searchPoolCandidates.filter(notEmpty),
    [searchPoolCandidates],
  );

  return <Table data={memoizedData} columns={columns} />;
};

export type AbstractFilter = PoolCandidateFilter | ApplicantFilter;

export function isPoolCandidateFilter(
  filter: AbstractFilter,
): filter is PoolCandidateFilter {
  // eslint-disable-next-line no-underscore-dangle
  if (filter.__typename === "PoolCandidateFilter") return true;

  return false;
}

const transformPoolCandidateFilterToFilterInput = (
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

function classificationToInput(c: Classification): ClassificationFilterInput {
  return pick(c, ["group", "level"]);
}

// Maps each property in ApplicantFilterInput to a function which transforms the matching value from an ApplicantFilter object to the appropriate shape for ApplicantFilterInput.
type MappingType = {
  [Property in keyof Omit<
    ApplicantFilterInput,
    "email" | "name" | "generalSearch"
  >]: (x: ApplicantFilter[Property]) => ApplicantFilterInput[Property];
};

const transformApplicantFilterToPoolCandidateSearchInput = (
  applicantFilter: ApplicantFilter,
): PoolCandidateSearchInput => {
  // GraphQL will error if an input object includes any unexpected attributes.
  // Therefore, transforming ApplicantFilter to ApplicantFilterInput requires omitting any fields not included in the Input type.
  const mapping: MappingType = {
    equity: omitIdAndTypename,
    expectedClassifications: (classifications) =>
      classifications?.filter(notEmpty).map(classificationToInput),
    hasDiploma: identity,
    languageAbility: identity,
    locationPreferences: identity,
    operationalRequirements: identity,
    pools: (pools) => pools?.filter(notEmpty).map(pickId),
    skills: (skills) => skills?.filter(notEmpty).map(pickId),
    positionDuration: identity,
  };

  const emptyFilter: ApplicantFilterInput = {};

  return {
    applicantFilter: Object.entries(mapping).reduce(
      (applicantFilterInput, filterEntry) => {
        const [key, transform] = filterEntry;
        const typedKey = key as keyof MappingType;

        // There should be way to get the types to work without using "any", but I'm having trouble.
        // I think its safe to fallback on any here because mapping has just been defined, and we can be confident that key and transform line up correctly.

        // eslint-disable-next-line no-param-reassign
        applicantFilterInput[typedKey] = transform(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          applicantFilter[typedKey] as any,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ) as any;
        return applicantFilterInput;
      },
      emptyFilter,
    ),
    poolCandidateStatus: [
      PoolCandidateStatus.QualifiedAvailable,
      PoolCandidateStatus.PlacedCasual,
    ],
  };
};

export const SingleSearchRequestTableApi: React.FunctionComponent<{
  filter: AbstractFilter;
}> = ({ filter }) => {
  const isLegacyFilter = isPoolCandidateFilter(filter);

  const poolCandidateFilterInput = isLegacyFilter
    ? transformPoolCandidateFilterToFilterInput(filter)
    : undefined;
  const [legacyResult] = useSearchPoolCandidatesQuery({
    variables: { poolCandidateFilter: poolCandidateFilterInput },
    pause: !isLegacyFilter,
  });
  const applicantFilterInput = !isLegacyFilter
    ? transformApplicantFilterToPoolCandidateSearchInput(filter)
    : undefined;

  return isLegacyFilter ? (
    <Pending fetching={legacyResult.fetching} error={legacyResult.error}>
      <SingleSearchRequestTable
        searchPoolCandidates={legacyResult.data?.searchPoolCandidates ?? []}
      />
    </Pending>
  ) : (
    <PoolCandidatesTable initialFilterInput={applicantFilterInput} />
  );
};
