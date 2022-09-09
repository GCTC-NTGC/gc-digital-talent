import React, { useMemo } from "react";
import { useIntl } from "react-intl";
import { Pill } from "@common/components";
import { notEmpty } from "@common/helpers/util";
import { FromArray } from "@common/types/utilityTypes";
import { getLocale } from "@common/helpers/localize";
import { getOperationalRequirement } from "@common/constants/localizedConstants";
import Pending from "@common/components/Pending";
import {
  SearchPoolCandidatesQuery,
  useSearchPoolCandidatesQuery,
  PoolCandidateFilterInput,
} from "../../api/generated";
import Table, { ColumnsOf } from "../Table";

type Data = NonNullable<
  FromArray<SearchPoolCandidatesQuery["searchPoolCandidates"]>
>;

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
          description:
            "Title displayed on the single search request table id column.",
        }),
        accessor: "id",
      },
      {
        Header: intl.formatMessage({
          defaultMessage: "Candidate Name",
          description:
            "Title displayed on the single search request table candidate name column.",
        }),
        accessor: ({ user }) => `${user?.firstName} ${user?.lastName}`,
      },
      {
        Header: intl.formatMessage({
          defaultMessage: "Group and Level",
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
                    description:
                      "Message for woman option in the employment equity column on the the single search request table.",
                  }),
                ]
              : []),
            ...(isVisibleMinority
              ? [
                  intl.formatMessage({
                    defaultMessage: "Visible Minority",
                    description:
                      "Message for visible minority option in the employment equity column on the the single search request table.",
                  }),
                ]
              : []),
            ...(isIndigenous
              ? [
                  intl.formatMessage({
                    defaultMessage: "Indigenous",
                    description:
                      "Message for indigenous option in the employment equity column on the the single search request table.",
                  }),
                ]
              : []),
            ...(hasDisability
              ? [
                  intl.formatMessage({
                    defaultMessage: "Disability",
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
                    description:
                      "Error message displayed on the single search request table operational requirements column.",
                  })}
              </Pill>
            );
          }),
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

export const SingleSearchRequestTableApi: React.FunctionComponent<{
  poolCandidateFilter: PoolCandidateFilterInput;
}> = ({ poolCandidateFilter }) => {
  const [result] = useSearchPoolCandidatesQuery({
    variables: { poolCandidateFilter },
  });
  const { data, fetching, error } = result;

  return (
    <Pending fetching={fetching} error={error}>
      <SingleSearchRequestTable
        searchPoolCandidates={data?.searchPoolCandidates ?? []}
      />
    </Pending>
  );
};
