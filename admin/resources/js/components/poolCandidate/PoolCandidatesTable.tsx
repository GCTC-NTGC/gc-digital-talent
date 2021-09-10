import React, { useMemo } from "react";
import { defineMessages, useIntl } from "react-intl";
import { Button } from "gc-digital-talent-common/components";
import {
  notEmpty,
  navigate,
  useLocation,
} from "gc-digital-talent-common/helpers";
import { commonMessages } from "gc-digital-talent-common/messages";
import {
  GetPoolCandidatesQuery,
  useGetPoolCandidatesByPoolQuery,
} from "../../api/generated";
import { FromArray } from "../../types/utilityTypes";
import Table, { ColumnsOf } from "../Table";
import TableBoolean from "../TableBoolean";

const messages = defineMessages({
  columnIdTitle: {
    id: "poolCandidatesTable.column.idTitle",
    defaultMessage: "ID",
    description: "Title displayed on the Pool Candidates table ID column.",
  },
  columnPoolTitle: {
    id: "poolCandidatesTable.column.poolTitle",
    defaultMessage: "Pool",
    description: "Title displayed for the Pool Candidates table Pool column.",
  },
  columnUserTitle: {
    id: "poolCandidatesTable.column.userTitle",
    defaultMessage: "User",
    description: "Title displayed for the Pool Candidates table User column.",
  },
  columnExpiryTitle: {
    id: "poolCandidatesTable.column.expiryTitle",
    defaultMessage: "Expiry",
    description: "Title displayed for the Pool Candidates table Expiry column.",
  },
  columnWomanTitle: {
    id: "poolCandidatesTable.column.womanTitle",
    defaultMessage: "Woman",
    description: "Title displayed for the Pool Candidates table Woman column.",
  },
  columnDisabilityTitle: {
    id: "poolCandidatesTable.column.disabilityTitle",
    defaultMessage: "Disability",
    description:
      "Title displayed for the Pool Candidates table Disability column.",
  },
  columnIndigenousTitle: {
    id: "poolCandidatesTable.column.indigenousTitle",
    defaultMessage: "Indigenous",
    description:
      "Title displayed for the Pool Candidates table Indigenous column.",
  },
  columnVisibleMinorityTitle: {
    id: "poolCandidatesTable.column.visibleMinorityTitle",
    defaultMessage: "Visible Minority",
    description:
      "Title displayed for the Pool Candidates table Visible Minority column.",
  },
  columnDiplomaTitle: {
    id: "poolCandidatesTable.column.diplomaTitle",
    defaultMessage: "Diploma",
    description:
      "Title displayed for the Pool Candidates table Diploma column.",
  },
  columnLanguageTitle: {
    id: "poolCandidatesTable.column.languageTitle",
    defaultMessage: "Language",
    description:
      "Title displayed for the Pool Candidates table Language column.",
  },
  nameTitle: {
    id: "poolCandidatesTable.column.firstLast",
    defaultMessage: "Name",
    description: "Title displayed on the Pool Candidates table name column.",
  },
  emailTitle: {
    id: "poolCandidatesTable.column.email",
    defaultMessage: "Email",
    description: "Title displayed on the Pool Candidates table email column.",
  },
  telephoneTitle: {
    id: "poolCandidatesTable.column.telephone",
    defaultMessage: "Telephone",
    description:
      "Title displayed on the Pool Candidates table telephone column.",
  },
  preferredLangTitle: {
    id: "poolCandidatesTable.column.preferred",
    defaultMessage: "Preferred Lang",
    description:
      "Title displayed on the Pool Candidates table Preferred Lang column.",
  },
  columnEditTitle: {
    id: "poolCandidatesTable.column.editTitle",
    defaultMessage: "Edit",
    description: "Title displayed for the Pool Candidates table Edit column.",
  },
});

type Data = NonNullable<FromArray<GetPoolCandidatesQuery["poolCandidates"]>>;

const PoolCandidatesTable: React.FC<
  GetPoolCandidatesQuery & { editUrlRoot: string }
> = ({ poolCandidates, editUrlRoot }) => {
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
        accessor: ({ user }) => `${user?.firstName} ${user?.lastName}`,
      },
      {
        Header: intl.formatMessage(messages.telephoneTitle),
        id: "telephone",
        accessor: ({ user }) => user?.telephone,
      },
      {
        Header: intl.formatMessage(messages.preferredLangTitle),
        id: "preferredLang",
        accessor: ({ user }) => user?.preferredLang,
      },
      {
        Header: intl.formatMessage(messages.columnEditTitle),
        id: "edit",
        accessor: ({ id }) => (
          <Button
            color="primary"
            mode="inline"
            onClick={(event) => {
              event.preventDefault();
              navigate(`${editUrlRoot}/${id}/edit`);
            }}
          >
            {intl.formatMessage(messages.columnEditTitle)}
          </Button>
        ),
      },
    ],
    [intl, editUrlRoot],
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

export const PoolCandidatesTableApi: React.FC<{ poolId: string }> = ({
  poolId,
}) => {
  const intl = useIntl();
  const [result] = useGetPoolCandidatesByPoolQuery({
    variables: { id: poolId },
  });
  const { data, fetching, error } = result;
  const { pathname } = useLocation();

  if (fetching) return <p>{intl.formatMessage(commonMessages.loadingTitle)}</p>;
  if (error)
    return (
      <p>
        {intl.formatMessage(commonMessages.loadingError)} {error.message}
      </p>
    );

  return (
    <PoolCandidatesTable
      poolCandidates={data?.pool?.poolCandidates ?? []}
      editUrlRoot={pathname}
    />
  );
};
