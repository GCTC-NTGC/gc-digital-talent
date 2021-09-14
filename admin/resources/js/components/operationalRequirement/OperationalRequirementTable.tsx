import React, { useMemo } from "react";
import { defineMessages, useIntl } from "react-intl";
import { Button } from "@common/components";
import {
  navigate,
  useLocation,
  notEmpty,
} from "@common/helpers";
import { commonMessages } from "@common/messages";
import {
  GetOperationalRequirementsQuery,
  useGetOperationalRequirementsQuery,
} from "../../api/generated";
import { FromArray } from "../../types/utilityTypes";
import DashboardContentContainer from "../DashboardContentContainer";
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
            color="primary"
            mode="inline"
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
          {intl.formatMessage(commonMessages.loadingError)} {error.message}
        </p>
      </DashboardContentContainer>
    );

  return (
    <OperationalRequirementTable
      operationalRequirements={data?.operationalRequirements ?? []}
      editUrlRoot={pathname}
    />
  );
};
