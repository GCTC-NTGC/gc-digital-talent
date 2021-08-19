import React, { useMemo } from "react";
import { defineMessages, useIntl } from "react-intl";
import {
  GetOperationalRequirementsQuery,
  useGetOperationalRequirementsQuery,
} from "../../api/generated";
import { navigate, useLocation } from "../../helpers/router";
import { notEmpty } from "../../helpers/util";
import { FromArray } from "../../types/utilityTypes";
import commonMessages from "../commonMessages";
import Button from "../H2Components/Button";
import Table, { ColumnsOf } from "../Table";

const messages = defineMessages({
  columnIdTitle: {
    id: "operationalRequirementTable.column.idTitle",
    defaultMessage: "ID",
    description:
      "Title displayed on the Operational Requirement table ID column.",
  },
  columnKeyTitle: {
    id: "operationalRequirementTable.column.keyTitle",
    defaultMessage: "Key",
    description:
      "Title displayed for the Operational Requirement table Key column.",
  },
  columnNameTitle: {
    id: "operationalRequirementTable.column.nameTitle",
    defaultMessage: "Name",
    description:
      "Title displayed for the Operational Requirement table Name column.",
  },
  columnDescriptionTitle: {
    id: "operationalRequirementTable.column.descriptionTitle",
    defaultMessage: "Level",
    description:
      "Title displayed for the Operational Requirement table Description column.",
  },
  columnEditTitle: {
    id: "operationalRequirementTable.column.editTitle",
    defaultMessage: "Edit",
    description:
      "Title displayed for the Operational Requirement table Edit column.",
  },
});

type Data = NonNullable<
  FromArray<GetOperationalRequirementsQuery["operationalRequirements"]>
>;

export const OperationalRequirementTable: React.FC<
  GetOperationalRequirementsQuery & { editUrlRoot: string }
> = ({ operationalRequirements, editUrlRoot }) => {
  const intl = useIntl();
  const columns = useMemo<ColumnsOf<Data>>(
    () => [
      {
        Header: intl.formatMessage(messages.columnIdTitle),
        accessor: "id",
      },
      {
        Header: intl.formatMessage(messages.columnKeyTitle),
        accessor: "key",
      },
      {
        Header: intl.formatMessage(messages.columnNameTitle),
        id: "name",
        accessor: (d) => d.name?.en,
      },
      {
        Header: intl.formatMessage(messages.columnDescriptionTitle),
        id: "description",
        accessor: (d) => d.description?.en,
      },
      {
        Header: intl.formatMessage(messages.columnEditTitle),
        id: "edit",
        accessor: ({ id }) => (
          <Button
            color="white"
            mode="solid"
            onClick={(event) => {
              event.preventDefault();
              navigate(`${editUrlRoot}/${id}/edit`);
            }}
          >
            Edit
          </Button>
        ),
      },
    ],
    [editUrlRoot, intl],
  );

  const memoizedData = useMemo(
    () => operationalRequirements.filter(notEmpty),
    [operationalRequirements],
  );

  return (
    <>
      <Table data={memoizedData} columns={columns} />
    </>
  );
};

export const OperationalRequirementTableApi: React.FC = () => {
  const intl = useIntl();
  const [result] = useGetOperationalRequirementsQuery();
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
    <OperationalRequirementTable
      operationalRequirements={data?.operationalRequirements ?? []}
      editUrlRoot={pathname}
    />
  );
};
