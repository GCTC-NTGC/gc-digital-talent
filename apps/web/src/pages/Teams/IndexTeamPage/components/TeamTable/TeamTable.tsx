import React, { useMemo } from "react";
import { IntlShape, useIntl } from "react-intl";

import Pending from "@common/components/Pending";
import { Link } from "@common/components";
import useLocale from "@common/hooks/useLocale";
import { notEmpty } from "@common/helpers/util";

import { Maybe, Team, useListTeamsQuery } from "~/api/generated";
import useRoutes from "~/hooks/useRoutes";
import Table, {
  ColumnsOf,
  tableActionsAccessor,
} from "~/components/Table/ClientManagedTable";

interface TeamTableProps {
  teams: Array<Team>;
}

interface ICell {
  value: string;
  row: {
    original: Team;
  };
}

const viewAccessor = (url: string, label: Maybe<string>, intl: IntlShape) => (
  <Link href={url} type="link">
    {label ||
      intl.formatMessage({
        defaultMessage: "No name provided",
        id: "L9Ked5",
        description: "Fallback for team display name value",
      })}
  </Link>
);

const emailLinkAccessor = (email: Maybe<string>, intl: IntlShape) => {
  if (email) {
    return <a href={`mailto:${email}`}>{email}</a>;
  }
  return (
    <span data-h2-font-style="base(italic)">
      {intl.formatMessage({
        defaultMessage: "No email provided",
        id: "1JCjTP",
        description: "Fallback for email value",
      })}
    </span>
  );
};

export const TeamTable = ({ teams }: TeamTableProps) => {
  const intl = useIntl();
  const { locale } = useLocale();
  const paths = useRoutes();

  const columns = useMemo<ColumnsOf<Team>>(
    () => [
      {
        Header: intl.formatMessage({
          defaultMessage: "Actions",
          id: "OxeGLu",
          description: "Title displayed for the team table actions column",
        }),
        accessor: (d) =>
          tableActionsAccessor({
            id: d.id,
            label: d?.displayName ? d.displayName[locale] : d.name,
            editPathFunc: paths.teamUpdate,
          }),
      },
      {
        Header: intl.formatMessage({
          defaultMessage: "Team",
          id: "KIWVbp",
          description: "Title displayed for the teams table team column.",
        }),
        accessor: (d) => (d?.displayName ? d.displayName[locale] : d.name),
        Cell: ({ row, value }: ICell) =>
          viewAccessor(paths.teamView(row.original.id), value, intl),
      },
      {
        Header: intl.formatMessage({
          defaultMessage: "Department",
          id: "BDo1aH",
          description: "Title displayed for the teams table department column.",
        }),
        accessor: (d) =>
          d.departments?.length
            ? d.departments
                .map((department) => department?.name[locale] || undefined)
                .filter(notEmpty)
                .join(", ")
            : "",
      },
      {
        Header: intl.formatMessage({
          defaultMessage: "Email",
          id: "TREL4U",
          description: "Title displayed for the teams table email column.",
        }),
        accessor: (d) => d.contactEmail,
        Cell: ({ value }: ICell) => emailLinkAccessor(value, intl),
      },
    ],
    [paths, intl, locale],
  );

  const data = useMemo(() => teams.filter(notEmpty), [teams]);

  return (
    <Table
      data={data}
      columns={columns}
      addBtn={{
        path: paths.teamCreate(),
        label: intl.formatMessage({
          defaultMessage: "Create Team",
          id: "GtrrJ3",
          description: "Link text to create a new team in the admin portal",
        }),
      }}
    />
  );
};

const TeamTableApi = () => {
  const [{ data, fetching, error }] = useListTeamsQuery();

  const teams = data?.teams.filter(notEmpty);

  return (
    <Pending fetching={fetching} error={error}>
      <TeamTable teams={teams || []} />
    </Pending>
  );
};

export default TeamTableApi;
