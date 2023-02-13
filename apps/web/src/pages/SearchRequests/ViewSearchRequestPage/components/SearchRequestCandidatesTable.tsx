import React, { useMemo } from "react";
import { IntlShape, useIntl } from "react-intl";
import omit from "lodash/omit";
import pick from "lodash/pick";

import { Link, Pill, Pending } from "@gc-digital-talent/ui";
import { identity, notEmpty } from "@gc-digital-talent/helpers";
import { getOperationalRequirement } from "@gc-digital-talent/i18n";

import { FromArray } from "~/types/utility";
import { getFullNameLabel } from "~/utils/nameUtils";
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
  Maybe,
  PoolCandidate,
  OperationalRequirement,
  Applicant,
} from "~/api/generated";
import Table, { ColumnsOf, Cell } from "~/components/Table/ClientManagedTable";
import useRoutes from "~/hooks/useRoutes";
import PoolCandidatesTable from "~/components/PoolCandidatesTable/PoolCandidatesTable";

type Data = NonNullable<
  FromArray<SearchPoolCandidatesQuery["searchPoolCandidates"]>
>;

type CandidateCell = Cell<PoolCandidate>;

const TableEditButton: React.FC<{
  poolCandidateId?: string;
  poolId?: string;
  label?: string;
}> = ({ poolCandidateId, poolId, label }) => {
  const intl = useIntl();
  const paths = useRoutes();
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

const classificationsCell = (
  classifications: Maybe<Maybe<Classification>[]>,
) => {
  const filteredClassifications = classifications
    ? classifications.filter((classification) => !!classification)
    : null;
  const pillsArray = filteredClassifications
    ? filteredClassifications.map((classification) => {
        return (
          <Pill
            key={`${classification?.group}-${classification?.level}`}
            color="primary"
            mode="outline"
          >
            {classification?.group}&#8209;{classification?.level}
          </Pill>
        );
      })
    : null;

  return pillsArray ? <span>{pillsArray}</span> : null;
};

const operationalRequirementsCell = (
  operationalRequirements: Maybe<Maybe<OperationalRequirement>[]>,
  intl: IntlShape,
) => {
  const requirements = operationalRequirements
    ?.filter(notEmpty)
    .map((requirement) => (
      <Pill key={requirement} color="primary" mode="outline">
        {intl.formatMessage(
          requirement
            ? getOperationalRequirement(requirement)
            : {
                defaultMessage: "Error: Name not found.",
                description:
                  "Error message displayed on the single search request table operational requirements column.",
              },
        )}
      </Pill>
    ));

  return requirements ? <span>{requirements}</span> : null;
};

const getEmploymentEquityItems = (user: Applicant, intl: IntlShape) => [
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

const employmentEquityCell = (user: Applicant, intl: IntlShape) => {
  const equityItems = getEmploymentEquityItems(user, intl)
    .filter(notEmpty)
    .map((option) => {
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

  return equityItems ? <span>{equityItems}</span> : null;
};

const employmentEquityAccessor = (user: Applicant, intl: IntlShape) =>
  getEmploymentEquityItems(user, intl)
    .filter(notEmpty)
    .map(
      (option) =>
        option ||
        intl.formatMessage({
          defaultMessage: "Error: Name not found.",
          id: "c9jMPS",
          description:
            "Error message displayed on the single search request table employment equity column.",
        }),
    )
    .sort()
    .join("-");

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
        Cell: ({ row }: CandidateCell) => {
          return classificationsCell(row.original.user.expectedClassifications);
        },
        accessor: (d) => {
          let classificationsString = "";
          if (
            d.user.expectedClassifications &&
            d.user.expectedClassifications.length > 0
          ) {
            d.user.expectedClassifications.forEach((classification) => {
              if (classification) {
                const groupLevelString = `${classification.group}-${classification.level} `;
                classificationsString += groupLevelString;
              }
            });
          }
          return classificationsString;
        },
        sortType: (rowA, rowB, id, desc) => {
          // passing in sortType to override default sort
          const rowAGroup =
            rowA.original.user.expectedClassifications &&
            rowA.original.user.expectedClassifications[0]
              ? rowA.original.user.expectedClassifications[0].group
              : "";
          const rowBGroup =
            rowB.original.user.expectedClassifications &&
            rowB.original.user.expectedClassifications[0]
              ? rowB.original.user.expectedClassifications[0].group
              : "";
          const rowALevel =
            rowA.original.user.expectedClassifications &&
            rowA.original.user.expectedClassifications[0]
              ? rowA.original.user.expectedClassifications[0].level
              : 0;
          const rowBLevel =
            rowB.original.user.expectedClassifications &&
            rowB.original.user.expectedClassifications[0]
              ? rowB.original.user.expectedClassifications[0].level
              : 0;

          if (rowAGroup.toLowerCase() > rowBGroup.toLowerCase()) {
            return 1;
          }
          if (rowAGroup.toLowerCase() < rowBGroup.toLowerCase()) {
            return -1;
          }
          // if groups identical then sort by level
          // level sorting adjusted to always be ascending regardless of whether group sort is A-Z or Z-A
          if (rowALevel > rowBLevel) {
            return desc ? -1 : 1;
          }
          if (rowALevel < rowBLevel) {
            return desc ? 1 : -1;
          }
          return 0;
        },
      },
      {
        Header: intl.formatMessage({
          defaultMessage: "Operational Requirements",
          id: "gN/+W2",
          description:
            "Title displayed on the single search request table operational requirements column.",
        }),
        Cell: ({ row: { original: poolCandidate } }: CandidateCell) =>
          operationalRequirementsCell(
            poolCandidate.user.acceptedOperationalRequirements,
            intl,
          ),
        accessor: ({ user }) =>
          user.acceptedOperationalRequirements
            ?.map((operationalRequirement) =>
              intl.formatMessage(
                operationalRequirement
                  ? getOperationalRequirement(operationalRequirement)
                  : {
                      defaultMessage: "Error: Name not found.",
                      description:
                        "Error message displayed on the single search request table operational requirements column.",
                    },
              ),
            )
            .sort()
            .join(", "),
      },
      {
        Header: intl.formatMessage({
          defaultMessage: "Employment Equity",
          id: "i45Vxz",
          description:
            "Title displayed on the single search request table employment equity column.",
        }),
        accessor: ({ user }) => employmentEquityAccessor(user, intl),
        Cell: ({ row: { original: poolCandidate } }: CandidateCell) =>
          employmentEquityCell(poolCandidate.user, intl),
      },
      {
        Header: intl.formatMessage({
          defaultMessage: "Edit",
          id: "lo2bSB",
          description:
            "Title displayed for the single search request table edit column.",
        }),
        accessor: (d) => `Edit ${d.id}`,
        disableGlobalFilter: true,
        Cell: ({
          row: {
            original: { user, id, pool },
          },
        }: CandidateCell) =>
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
    poolCandidateStatus: [
      PoolCandidateStatus.PlacedCasual,
      PoolCandidateStatus.QualifiedAvailable,
    ],
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

const SingleSearchRequestTableApi: React.FunctionComponent<{
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

export default SingleSearchRequestTableApi;
