import React, { useMemo } from "react";
import { defineMessages, useIntl } from "react-intl";
import {
  GetPoolCandidatesQuery,
  useGetPoolCandidatesQuery,
} from "../../api/generated";
import { notEmpty } from "../../helpers/util";
import { FromArray } from "../../types/utilityTypes";
import Table, { ColumnsOf } from "../Table";
import TableBoolean from "../TableBoolean";
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
  nameTitle: {
    id: "poolCandidatesTable.column.firstLast",
    defaultMessage: "Name",
    description:
      "Title displayed on the Operational Requirement table name column.",
  },
  emailTitle: {
    id: "poolCandidatesTable.column.email",
    defaultMessage: "Email",
    description:
      "Title displayed on the Operational Requirement table email column.",
  },
  telephoneTitle: {
    id: "poolCandidatesTable.column.telephone",
    defaultMessage: "Telephone",
    description:
      "Title displayed on the Operational Requirement table telephone column.",
  },
  preferredLangTitle: {
    id: "poolCandidatesTable.column.preferred",
    defaultMessage: "Preferred Lang",
    description:
      "Title displayed on the Operational Requirement table Preferred Lang column.",
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
        accessor: ({ isWoman }) => <TableBoolean checked={isWoman} />,
        id: "woman",
      },
      {
        Header: intl.formatMessage(messages.columnDisabilityTitle),
        accessor: ({ hasDisability }) => (
          <TableBoolean checked={hasDisability} />
        ),
        id: "disability",
      },
      {
        Header: intl.formatMessage(messages.columnIndigenousTitle),
        accessor: ({ isIndigenous }) => <TableBoolean checked={isIndigenous} />,
        id: "indigenous",
      },
      {
        Header: intl.formatMessage(messages.columnVisibleMinorityTitle),
        accessor: ({ isVisibleMinority }) => (
          <TableBoolean checked={isVisibleMinority} />
        ),
        id: "visibleMinority",
      },
      {
        Header: intl.formatMessage(messages.columnDiplomaTitle),
        accessor: ({ hasDiploma }) => <TableBoolean checked={hasDiploma} />,
        id: "diploma",
      },
      {
        Header: intl.formatMessage(messages.columnLanguageTitle),
        accessor: "languageAbility",
      },
      {
        Header: intl.formatMessage(messages.nameTitle),
        accessor: ({ firstName, lastName }) => `${firstName} ${lastName}`,
      },
      {
        Header: intl.formatMessage(messages.telephoneTitle),
        accessor: "telephone",
      },
      {
        Header: intl.formatMessage(messages.preferredLangTitle),
        accessor: "preferredLang",
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
