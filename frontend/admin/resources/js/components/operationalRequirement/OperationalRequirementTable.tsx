import React, { useMemo } from "react";
import { useIntl } from "react-intl";
import { useLocation } from "@common/helpers/router";
import { notEmpty } from "@common/helpers/util";
import { commonMessages } from "@common/messages";
import { FromArray } from "@common/types/utilityTypes";
import { getLocale } from "@common/helpers/localize";
import {
  GetOperationalRequirementsQuery,
  useGetOperationalRequirementsQuery,
} from "../../api/generated";
import DashboardContentContainer from "../DashboardContentContainer";
import Table, { ColumnsOf } from "../Table";
import { tableEditButtonAccessor } from "../TableEditButton";

type Data = NonNullable<
  FromArray<GetOperationalRequirementsQuery["operationalRequirements"]>
>;

export const OperationalRequirementTable: React.FC<
  GetOperationalRequirementsQuery & { editUrlRoot: string }
> = ({ operationalRequirements, editUrlRoot }) => {
  const intl = useIntl();
  const locale = getLocale(intl);
  const columns = useMemo<ColumnsOf<Data>>(
    () => [
      {
        Header: intl.formatMessage({
          defaultMessage: "ID",
          description:
            "Title displayed on the Operational Requirement table ID column.",
        }),
        accessor: "id",
      },
      {
        Header: intl.formatMessage({
          defaultMessage: "Key",
          description:
            "Title displayed for the Operational Requirement table Key column.",
        }),
        accessor: "key",
      },
      {
        Header: intl.formatMessage({
          defaultMessage: "Name",
          description:
            "Title displayed for the Operational Requirement table Name column.",
        }),
        accessor: (d) => d.name?.[locale],
      },
      {
        Header: intl.formatMessage({
          defaultMessage: "Description",
          description:
            "Title displayed for the Operational Requirement table Description column.",
        }),
        accessor: (d) => d.description?.[locale],
      },
      {
        Header: intl.formatMessage({
          defaultMessage: "Edit",
          description:
            "Title displayed for the Operational Requirement table Edit column.",
        }),
        accessor: (d) => tableEditButtonAccessor(d.id, editUrlRoot), // callback extracted to separate function to stabilize memoized component
      },
    ],
    [editUrlRoot, intl, locale],
  );

  const memoizedData = useMemo(
    () => operationalRequirements.filter(notEmpty),
    [operationalRequirements],
  );

  return <Table data={memoizedData} columns={columns} />;
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
          {intl.formatMessage(commonMessages.loadingError)}
          {error.message}
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
