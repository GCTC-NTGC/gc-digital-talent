import React, { useMemo } from "react";
import { defineMessages, useIntl } from "react-intl";
import { Button } from "@common/components";

import { navigate, useLocation } from "@common/helpers/router";
import { notEmpty } from "@common/helpers/util";
import { commonMessages } from "@common/messages";
import { FromArray } from "@common/types/utilityTypes";
import {
  GetOperationalRequirementsQuery,
  useGetOperationalRequirementsQuery,
} from "../../api/generated";
import DashboardContentContainer from "../DashboardContentContainer";
import Table, { ColumnsOf } from "../Table";

const messages = defineMessages({
  columnIdTitle: {
    defaultMessage: "ID",
    description:
      "Title displayed on the Operational Requirement table ID column.",
  },
  columnKeyTitle: {
    defaultMessage: "Key",
    description:
      "Title displayed for the Operational Requirement table Key column.",
  },
  columnNameTitle: {
    defaultMessage: "Name",
    description:
      "Title displayed for the Operational Requirement table Name column.",
  },
  columnDescriptionTitle: {
    defaultMessage: "Description",
    description:
      "Title displayed for the Operational Requirement table Description column.",
  },
  columnEditTitle: {
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
        accessor: (d) => d.name?.en,
      },
      {
        Header: intl.formatMessage(messages.columnDescriptionTitle),
        accessor: (d) => d.description?.en,
      },
      {
        Header: intl.formatMessage(messages.columnEditTitle),
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
