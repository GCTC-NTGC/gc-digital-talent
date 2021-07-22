import React, { useMemo } from "react";
import { defineMessages, useIntl } from "react-intl";
import {
  GetPoolCandidatesQuery,
  useGetPoolCandidatesQuery,
} from "../../api/generated";
import { notEmpty } from "../../helpers/util";
import { FromArray } from "../../types/utilityTypes";
import Table, { ColumnsOf } from "../Table";
import commonMessages from "../commonMessages";

const messages = defineMessages({
  columnIdTitle: {
    id: "poolCandidatesTable.column.idTitle",
    defaultMessage: "ID",
    description:
      "Title displayed on the Operational Requirement table ID column.",
  },
  columnPoolTitle: {
    id: "poolCandidatesTable.column.poolTitle",
    defaultMessage: "Pool",
    description:
      "Title displayed for the Operational Requirement table Pool column.",
  },
  columnUserTitle: {
    id: "poolCandidatesTable.column.userTitle",
    defaultMessage: "User",
    description:
      "Title displayed for the Operational Requirement table User column.",
  },
  columnExpiryTitle: {
    id: "poolCandidatesTable.column.expiryTitle",
    defaultMessage: "Expiry",
    description:
      "Title displayed for the Operational Requirement table Expiry column.",
  },
  columnWomanTitle: {
    id: "poolCandidatesTable.column.womanTitle",
    defaultMessage: "Woman",
    description:
      "Title displayed for the Operational Requirement table Woman column.",
  },
  columnDisabilityTitle: {
    id: "poolCandidatesTable.column.disabilityTitle",
    defaultMessage: "Disability",
    description:
      "Title displayed for the Operational Requirement table Disability column.",
  },
  columnIndigenousTitle: {
    id: "poolCandidatesTable.column.indigenousTitle",
    defaultMessage: "Indigenous",
    description:
      "Title displayed for the Operational Requirement table Indigenous column.",
  },
  columnVisibleMinorityTitle: {
    id: "poolCandidatesTable.column.visibleMinorityTitle",
    defaultMessage: "Visible Minority",
    description:
      "Title displayed for the Operational Requirement table Visible Minority column.",
  },
  columnDiplomaTitle: {
    id: "poolCandidatesTable.column.diplomaTitle",
    defaultMessage: "Diploma",
    description:
      "Title displayed for the Operational Requirement table Diploma column.",
  },
  columnLanguageTitle: {
    id: "poolCandidatesTable.column.languageTitle",
    defaultMessage: "Language",
    description:
      "Title displayed for the Operational Requirement table Language column.",
  },
});

type Data = NonNullable<FromArray<GetPoolCandidatesQuery["poolCandidates"]>>;

const PoolCandidatesTable: React.FC<GetPoolCandidatesQuery> = ({
  poolCandidates,
}) => {
  const intl = useIntl();
  const columns = useMemo<ColumnsOf<Data>>(
    () => [
      {
        Header: intl.formatMessage(messages.columnIdTitle),
        accessor: "cmoIdentifier",
      },
      {
        Header: intl.formatMessage(messages.columnPoolTitle),
        id: "pool",
        accessor: (d) => d.pool?.name?.en,
      },
      {
        Header: intl.formatMessage(messages.columnUserTitle),
        id: "user",
        accessor: (d) => d.user?.email,
      },
      {
        Header: intl.formatMessage(messages.columnExpiryTitle),
        accessor: "expiryDate",
      },
      {
        Header: intl.formatMessage(messages.columnWomanTitle),
        accessor: (d) => (d.isWoman ? "Y" : "N"),
        id: "woman",
      },
      {
        Header: intl.formatMessage(messages.columnDisabilityTitle),
        accessor: (d) => (d.hasDisability ? "Y" : "N"),
        id: "disability",
      },
      {
        Header: intl.formatMessage(messages.columnIndigenousTitle),
        accessor: (d) => (d.isIndigenous ? "Y" : "N"),
        id: "indigenous",
      },
      {
        Header: intl.formatMessage(messages.columnVisibleMinorityTitle),
        accessor: (d) => (d.isVisibleMinority ? "Y" : "N"),
        id: "visibleMinority",
      },
      {
        Header: intl.formatMessage(messages.columnDiplomaTitle),
        accessor: (d) => (d.hasDiploma ? "Y" : "N"),
        id: "diploma",
      },
      {
        Header: intl.formatMessage(messages.columnLanguageTitle),
        accessor: "languageAbility",
      },
    ],
    [intl],
  );

  const memoizedData = useMemo(
    () => poolCandidates.filter(notEmpty),
    [poolCandidates],
  );

  return (
    <>
      <Table data={memoizedData} columns={columns} />
    </>
  );
};

export default PoolCandidatesTable;

export const PoolCandidatesTableApi: React.FunctionComponent = () => {
  const intl = useIntl();
  const [result] = useGetPoolCandidatesQuery();
  const { data, fetching, error } = result;

  if (fetching) return <p>{intl.formatMessage(commonMessages.loadingTitle)}</p>;
  if (error)
    return (
      <p>
        {intl.formatMessage(commonMessages.loadingError)} {error.message}
      </p>
    );

  return <PoolCandidatesTable poolCandidates={data?.poolCandidates ?? []} />;
};
