import type { ColumnDef } from "@tanstack/react-table";
import { createColumnHelper } from "@tanstack/react-table";
import { useIntl } from "react-intl";
import { useLocation } from "react-router";

import { notEmpty } from "@gc-digital-talent/helpers";
import { Link } from "@gc-digital-talent/ui";
import type {
  TalentEventTableRowFragment,
  FragmentType,
} from "@gc-digital-talent/graphql";
import { graphql, getFragment } from "@gc-digital-talent/graphql";
import { commonMessages } from "@gc-digital-talent/i18n";
import { formatDate, parseDateTimeUtc } from "@gc-digital-talent/date-helpers";
import { ROLE_NAME, useAuthorization } from "@gc-digital-talent/auth";

import Table from "~/components/Table/ResponsiveTable/ResponsiveTable";
import useRoutes from "~/hooks/useRoutes";
import { checkRole } from "~/utils/teamUtils";
import adminMessages from "~/messages/adminMessages";

import { nominationsCell, statusCell } from "./helpers";

const columnHelper = createColumnHelper<TalentEventTableRowFragment>();

const TalentEventTableRow_Fragment = graphql(/* GraphQL */ `
  fragment TalentEventTableRow on TalentNominationEvent {
    id
    name {
      localized
    }
    countTalentNominationGroups
    status {
      value
      label {
        localized
      }
    }
    openDate
    closeDate
  }
`);

interface TalentEventTableProps {
  talentNominationEventQuery: FragmentType<
    typeof TalentEventTableRow_Fragment
  >[];
  title: string;
}

const TalentEventTable = ({
  talentNominationEventQuery,
  title,
}: TalentEventTableProps) => {
  const intl = useIntl();
  const routes = useRoutes();
  const talentNominationEvents = getFragment(
    TalentEventTableRow_Fragment,
    talentNominationEventQuery,
  );

  const { pathname, search, hash } = useLocation();
  const currentUrl = `${pathname}${search}${hash}`;

  const columns = [
    columnHelper.accessor((row) => row?.name?.localized, {
      id: "name",
      header: intl.formatMessage(commonMessages.name),
      cell: ({ row: { original: talentEvent } }) => (
        <Link href={routes.adminTalentManagementEvent(talentEvent.id)}>
          {talentEvent?.name?.localized}
        </Link>
      ),
      meta: {
        isRowTitle: true,
      },
    }),
    columnHelper.accessor((row) => row.countTalentNominationGroups, {
      id: "nominations",
      header: intl.formatMessage({
        defaultMessage: "Nominations",
        id: "KxsYhl",
        description: "Header for Nominations",
      }),
      cell: ({
        row: {
          original: { id },
        },
        getValue,
      }) => nominationsCell(id, getValue(), routes, intl),
      meta: {
        isRowTitle: true,
      },
    }),
    columnHelper.accessor((row) => row?.status?.label?.localized, {
      id: "status",
      header: intl.formatMessage(commonMessages.status),
      cell: ({ row: { original: talentEvent } }) =>
        statusCell(talentEvent?.status),
      meta: {
        isRowTitle: true,
      },
    }),
    columnHelper.accessor("openDate", {
      id: "openDate",
      header: intl.formatMessage(adminMessages.openingDate),
      cell: ({
        row: {
          original: { openDate },
        },
      }) =>
        formatDate({
          date: parseDateTimeUtc(openDate),
          formatString: "yyyy-MM-dd",
          intl,
        }),
    }),
    columnHelper.accessor("closeDate", {
      id: "closeDate",
      header: intl.formatMessage({
        defaultMessage: "Closing date",
        id: "tPCmUl",
        description: "Header for Closing date",
      }),
      cell: ({
        row: {
          original: { closeDate },
        },
      }) =>
        formatDate({
          date: parseDateTimeUtc(closeDate),
          formatString: "yyyy-MM-dd",
          intl,
        }),
    }),
  ] as ColumnDef<TalentEventTableRowFragment>[];

  const data = talentNominationEvents.filter(notEmpty);

  const { roleAssignments } = useAuthorization();
  const canCreateMembers = checkRole(
    [ROLE_NAME.CommunityAdmin, ROLE_NAME.CommunityTalentCoordinator],
    roleAssignments,
  );

  return (
    <Table<TalentEventTableRowFragment>
      data={data}
      caption={title}
      columns={columns}
      sort={{
        internal: true,
      }}
      pagination={{
        internal: true,
        total: data.length,
        pageSizes: [10, 20, 50, 100, 500],
      }}
      {...(canCreateMembers
        ? {
            add: {
              linkProps: {
                href: routes.createTalentManagementEvent(),
                label: intl.formatMessage({
                  defaultMessage: "Create talent nomination event",
                  id: "Ju0qLf",
                  description: "Button text to create talent nomination event",
                }),
                from: currentUrl,
              },
            },
            nullMessage: {
              description: intl.formatMessage({
                defaultMessage:
                  'Use the "Create talent nomination event" button to get started.',
                id: "eVffLG",
                description:
                  "Instructions for adding a talent nomination event item",
              }),
            },
          }
        : undefined)}
    />
  );
};

export default TalentEventTable;
