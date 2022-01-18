import React, { useMemo } from "react";
import { IntlShape, useIntl } from "react-intl";
import { notEmpty } from "@common/helpers/util";
import { useLocation } from "@common/helpers/router";
import { commonMessages } from "@common/messages";
import { FromArray } from "@common/types/utilityTypes";
import { getLocale } from "@common/helpers/localize";
import {
  getLanguage,
  getLanguageAbility,
} from "@common/constants/localizedConstants";
import {
  GetPoolCandidatesQuery,
  Language,
  LanguageAbility,
  useGetPoolCandidatesByPoolQuery,
} from "../../api/generated";
import Table, { ColumnsOf } from "../Table";
import { tableBooleanAccessor } from "../TableBoolean";
import DashboardContentContainer from "../DashboardContentContainer";
import { tableEditButtonAccessor } from "../TableEditButton";

type Data = NonNullable<FromArray<GetPoolCandidatesQuery["poolCandidates"]>>;

// callbacks extracted to separate function to stabilize memoized component
const languageAbilityAccessor = (
  languageAbility: LanguageAbility | null | undefined,
  intl: IntlShape,
) => (
  <span>
    {languageAbility
      ? intl.formatMessage(getLanguageAbility(languageAbility as string))
      : ""}
  </span>
);
const preferredLanguageAccessor = (
  language: Language | null | undefined,
  intl: IntlShape,
) => (
  <span>
    {language ? intl.formatMessage(getLanguage(language as string)) : ""}
  </span>
);

const PoolCandidatesTable: React.FC<
  GetPoolCandidatesQuery & { editUrlRoot: string }
> = ({ poolCandidates, editUrlRoot }) => {
  const intl = useIntl();
  const columns = useMemo<ColumnsOf<Data>>(
    () => [
      {
        Header: intl.formatMessage({
          defaultMessage: "ID",
          description:
            "Title displayed on the Pool Candidates table ID column.",
        }),
        accessor: "cmoIdentifier",
      },
      {
        Header: intl.formatMessage({
          defaultMessage: "Pool",
          description:
            "Title displayed for the Pool Candidates table Pool column.",
        }),
        accessor: (d) => d.pool?.name?.[getLocale(intl)],
      },
      {
        Header: intl.formatMessage({
          defaultMessage: "User",
          description:
            "Title displayed for the Pool Candidates table User column.",
        }),
        accessor: (d) => d.user?.email,
      },
      {
        Header: intl.formatMessage({
          defaultMessage: "Expiry",
          description:
            "Title displayed for the Pool Candidates table Expiry column.",
        }),
        accessor: "expiryDate",
      },
      {
        Header: intl.formatMessage({
          defaultMessage: "Woman",
          description:
            "Title displayed for the Pool Candidates table Woman column.",
        }),
        accessor: (d) => tableBooleanAccessor(d.isWoman), // callback extracted to separate function to stabilize memoized component
      },
      {
        Header: intl.formatMessage({
          defaultMessage: "Disability",
          description:
            "Title displayed for the Pool Candidates table Disability column.",
        }),
        accessor: (d) => tableBooleanAccessor(d.hasDisability), // callback extracted to separate function to stabilize memoized component
      },
      {
        Header: intl.formatMessage({
          defaultMessage: "Indigenous",
          description:
            "Title displayed for the Pool Candidates table Indigenous column.",
        }),
        accessor: (d) => tableBooleanAccessor(d.isIndigenous), // callback extracted to separate function to stabilize memoized component
      },
      {
        Header: intl.formatMessage({
          defaultMessage: "Visible Minority",
          description:
            "Title displayed for the Pool Candidates table Visible Minority column.",
        }),
        accessor: (d) => tableBooleanAccessor(d.isVisibleMinority), // callback extracted to separate function to stabilize memoized component
      },
      {
        Header: intl.formatMessage({
          defaultMessage: "Diploma",
          description:
            "Title displayed for the Pool Candidates table Diploma column.",
        }),
        accessor: (d) => tableBooleanAccessor(d.hasDiploma), // callback extracted to separate function to stabilize memoized component
      },
      {
        Header: intl.formatMessage({
          defaultMessage: "Language Ability",
          description:
            "Title displayed for the Pool Candidates table Language Ability column.",
        }),
        accessor: (poolCandidate) =>
          languageAbilityAccessor(poolCandidate.languageAbility, intl),
      },
      {
        Header: intl.formatMessage({
          defaultMessage: "Name",
          description:
            "Title displayed on the Pool Candidates table name column.",
        }),
        accessor: ({ user }) => `${user?.firstName} ${user?.lastName}`,
      },
      {
        Header: intl.formatMessage({
          defaultMessage: "Telephone",
          description:
            "Title displayed on the Pool Candidates table telephone column.",
        }),
        accessor: ({ user }) => user?.telephone,
      },
      {
        Header: intl.formatMessage({
          defaultMessage: "Preferred Language",
          description:
            "Title displayed on the Pool Candidates table Preferred Lang column.",
        }),
        accessor: ({ user }) =>
          preferredLanguageAccessor(user?.preferredLang, intl),
      },
      {
        Header: intl.formatMessage({
          defaultMessage: "Edit",
          description:
            "Title displayed for the Pool Candidates table Edit column.",
        }),
        accessor: (d) => tableEditButtonAccessor(d.id, editUrlRoot), // callback extracted to separate function to stabilize memoized component
      },
    ],
    [intl, editUrlRoot],
  );

  const memoizedData = useMemo(
    () => poolCandidates.filter(notEmpty),
    [poolCandidates],
  );

  return <Table data={memoizedData} columns={columns} />;
};

export default PoolCandidatesTable;

export const PoolCandidatesTableApi: React.FC<{ poolId: string }> = ({
  poolId,
}) => {
  const intl = useIntl();
  const [result] = useGetPoolCandidatesByPoolQuery({
    variables: { id: poolId },
  });
  const { data, fetching, error } = result;
  const { pathname } = useLocation();

  if (fetching)
    return (
      <DashboardContentContainer>
        <p>{intl.formatMessage(commonMessages.loadingTitle)}</p>
      </DashboardContentContainer>
    );
  if (error)
    return (
      <DashboardContentContainer>
        <p>
          {intl.formatMessage(commonMessages.loadingError)}
          {error.message}
        </p>
      </DashboardContentContainer>
    );

  return (
    <PoolCandidatesTable
      poolCandidates={data?.pool?.poolCandidates ?? []}
      editUrlRoot={pathname}
    />
  );
};
