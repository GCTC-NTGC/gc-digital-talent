import {
  ColumnDef,
  createColumnHelper,
  PaginationState,
} from "@tanstack/react-table";
import { useIntl } from "react-intl";
import { useState } from "react";
import { useQuery } from "urql";

import {
  getFragment,
  graphql,
  WorkforceAdjustmentRowFragment,
} from "@gc-digital-talent/graphql";
import { Link } from "@gc-digital-talent/ui";
import { uniqueItems, unpackMaybes } from "@gc-digital-talent/helpers";
import {
  commonMessages,
  getEmploymentEquityGroup,
  navigationMessages,
} from "@gc-digital-talent/i18n";

import { INITIAL_STATE } from "~/components/Table/ResponsiveTable/constants";
import Table, {
  getTableStateFromSearchParams,
} from "~/components/Table/ResponsiveTable/ResponsiveTable";
import { getFullNameHtml, getFullNameLabel } from "~/utils/nameUtils";
import useRoutes from "~/hooks/useRoutes";
import { getClassificationName } from "~/utils/poolUtils";
import cells from "~/components/Table/cells";
import accessors from "~/components/Table/accessors";
import pageTitles from "~/messages/pageTitles";
import profileMessages from "~/messages/profileMessages";

const WorkforceAdjustmentRow_Fragment = graphql(/** GraphQL */ `
  fragment WorkforceAdjustmentRow on UserEmployeeWFA {
    id
    firstName
    lastName
    workEmail
    classification {
      group
      level
    }
    preferredLang {
      value
      label {
        localized
      }
    }
    employeeWFA {
      wfaDate
      wfaUpdatedAt
      wfaInterest {
        value
        label {
          localized
        }
      }
    }
    department {
      name {
        localized
      }
    }
    communityInterests {
      community {
        workStreams {
          id
          name {
            localized
          }
        }
      }
    }
    isWoman
    hasDisability
    isVisibleMinority
    indigenousCommunities {
      value
    }
    acceptedOperationalRequirements {
      label {
        localized
      }
    }
    locationPreferences {
      label {
        localized
      }
    }
    userSkills {
      skill {
        id
        name {
          localized
        }
      }
    }
  }
`);

const WorkforceAdjustmentTable_Query = graphql(/** GraphQL */ `
  query WorkforceAdjustmentTable($first: Int, $page: Int) {
    employeeWFAPaginatedAdminTable(first: $first, page: $page) {
      data {
        ...WorkforceAdjustmentRow
      }
      paginatorInfo {
        count
        currentPage
        firstItem
        hasMorePages
        lastItem
        lastPage
        perPage
        total
      }
    }
  }
`);

const columnHelper = createColumnHelper<WorkforceAdjustmentRowFragment>();

const defaultState = {
  ...INITIAL_STATE,
  sortState: [{ id: "wfaUpdatedAt", desc: false }],
};

const WorkforceAdjustmentTable = () => {
  const intl = useIntl();
  const paths = useRoutes();
  const initialState = getTableStateFromSearchParams(defaultState);
  const [paginationState, setPaginationState] = useState<PaginationState>(
    initialState.paginationState
      ? {
          ...initialState.paginationState,
          pageIndex: initialState.paginationState.pageIndex + 1,
        }
      : INITIAL_STATE.paginationState,
  );

  const handlePaginationStateChange = ({
    pageIndex,
    pageSize,
  }: PaginationState) => {
    setPaginationState((previous) => ({
      pageIndex:
        previous.pageSize === pageSize
          ? (pageIndex ?? INITIAL_STATE.paginationState.pageIndex)
          : 0,
      pageSize: pageSize ?? INITIAL_STATE.paginationState.pageSize,
    }));
  };

  const [{ data, fetching }] = useQuery({
    query: WorkforceAdjustmentTable_Query,
    variables: {
      page: paginationState.pageIndex,
      first: paginationState.pageSize,
    },
  });

  const wfaEmployees = getFragment(
    WorkforceAdjustmentRow_Fragment,
    data?.employeeWFAPaginatedAdminTable.data,
  );

  const columns = [
    columnHelper.accessor(
      (user) => getFullNameLabel(user.firstName, user.lastName, intl),
      {
        id: "name",
        header: intl.formatMessage(commonMessages.name),
        cell: ({ row: { original: user } }) => {
          return user.id ? (
            <Link href={paths.userView(user.id)}>
              {getFullNameHtml(user.firstName, user.lastName, intl)}
            </Link>
          ) : null;
        },
        meta: {
          isRowTitle: true,
        },
      },
    ),
    columnHelper.accessor(
      ({ classification }) =>
        classification ? getClassificationName(classification, intl) : null,
      {
        id: "classification",
        header: intl.formatMessage({
          defaultMessage: "Current employee classification",
          id: "AkjJT0",
          description: "Column title for employee classification",
        }),
      },
    ),
    columnHelper.accessor(
      ({ preferredLang }) => preferredLang?.label?.localized ?? null,
      {
        id: "preferredLang",
        header: intl.formatMessage(commonMessages.workingLanguageAbility),
      },
    ),
    columnHelper.accessor(
      ({ employeeWFA }) => employeeWFA?.wfaInterest?.label.localized ?? null,
      {
        id: "wfaInterest",
        header: intl.formatMessage({
          defaultMessage: "WFA status",
          id: "/39iac",
          description: "Column title for employee WFA status",
        }),
      },
    ),
    columnHelper.accessor("workEmail", {
      id: "workEmail",
      header: intl.formatMessage(commonMessages.workEmail),
      cell: ({ getValue }) => cells.email(getValue()),
    }),
    columnHelper.accessor(
      ({ employeeWFA }) => accessors.date(employeeWFA?.wfaUpdatedAt),
      {
        id: "wfaUpdatedAt",
        enableColumnFilter: false,
        header: intl.formatMessage({
          defaultMessage: "WFA status updated date",
          id: "H7dCJ/",
          description:
            "Column title for what the employee WFA info was last updated",
        }),
        cell: ({
          row: {
            original: { employeeWFA },
          },
        }) => cells.date(employeeWFA?.wfaUpdatedAt, intl),
      },
    ),
    columnHelper.accessor(
      ({ employeeWFA }) => accessors.date(employeeWFA?.wfaDate),
      {
        id: "wfaDate",
        enableColumnFilter: false,
        header: intl.formatMessage({
          defaultMessage: "Position end date",
          id: "O4dmgB",
          description:
            "Column title for when a WFA employee expects to end their position",
        }),
        cell: ({
          row: {
            original: { employeeWFA },
          },
        }) => cells.date(employeeWFA?.wfaDate, intl),
      },
    ),
    columnHelper.accessor(({ department }) => department?.name.localized, {
      id: "department",
      enableColumnFilter: false,
      header: intl.formatMessage({
        defaultMessage: "Employee department",
        id: "p/a8C6",
        description: "Column title for an employees department",
      }),
    }),
    columnHelper.accessor(
      ({ communityInterests }) => {
        const streams = unpackMaybes(
          communityInterests?.flatMap((interest) =>
            interest.community.workStreams?.flatMap(
              (stream) => stream.name?.localized,
            ),
          ),
        );

        return uniqueItems(streams).join(", ");
      },
      {
        id: "workStreams",
        enableColumnFilter: false,
        enableSorting: false,
        header: intl.formatMessage(pageTitles.workStreams),
      },
    ),
    columnHelper.accessor(
      ({
        isWoman,
        isVisibleMinority,
        hasDisability,
        indigenousCommunities,
      }) => {
        let equity: string[] = [];
        if (isWoman) {
          equity = [
            ...equity,
            intl.formatMessage(getEmploymentEquityGroup("woman")),
          ];
        }

        if (isVisibleMinority) {
          equity = [
            ...equity,
            intl.formatMessage(getEmploymentEquityGroup("minority")),
          ];
        }

        if (hasDisability) {
          equity = [
            ...equity,
            intl.formatMessage(getEmploymentEquityGroup("disability")),
          ];
        }

        if (indigenousCommunities && indigenousCommunities?.length > 0) {
          equity = [
            ...equity,
            intl.formatMessage(getEmploymentEquityGroup("indigenous")),
          ];
        }

        return equity.join(", ");
      },
      {
        id: "employmentEquity",
        enableColumnFilter: false,
        enableSorting: false,
        header: intl.formatMessage(commonMessages.employmentEquity),
      },
    ),
    columnHelper.accessor(
      ({ acceptedOperationalRequirements }) =>
        unpackMaybes(
          acceptedOperationalRequirements?.flatMap(
            (pref) => pref?.label.localized,
          ),
        ).join(", "),
      {
        id: "workPreferences",
        header: intl.formatMessage(navigationMessages.workPreferences),
      },
    ),
    columnHelper.accessor(
      ({ locationPreferences }) =>
        unpackMaybes(
          locationPreferences?.flatMap((pref) => pref?.label.localized),
        ).join(", "),
      {
        id: "locationPreferences",
        header: intl.formatMessage(profileMessages.workLocationPreferences),
      },
    ),
    columnHelper.accessor(
      ({ userSkills }) =>
        unpackMaybes(
          userSkills?.flatMap((userSkill) => userSkill?.skill.name.localized),
        ).join(", "),
      {
        id: "skills",
        header: intl.formatMessage(navigationMessages.skills),
      },
    ),
  ] as ColumnDef<WorkforceAdjustmentRowFragment>[];

  return (
    <Table<WorkforceAdjustmentRowFragment>
      data={unpackMaybes(wfaEmployees)}
      columns={columns}
      isLoading={fetching}
      caption={intl.formatMessage({
        defaultMessage:
          "Information about employees’ workforce adjustment situation",
        id: "pOR8Lg",
        description: "Caption for the workforce adjustment table",
      })}
      hiddenColumnIds={[
        "wfaDate",
        "department",
        "workStreams",
        "employmentEquity",
        "workPreferences",
        "locationPreferences",
        "skills",
      ]}
      pagination={{
        internal: false,
        initialState: INITIAL_STATE.paginationState,
        state: paginationState,
        total: data?.employeeWFAPaginatedAdminTable?.paginatorInfo.total,
        pageSizes: [10, 20, 50],
        onPaginationChange: ({ pageIndex, pageSize }: PaginationState) => {
          handlePaginationStateChange({ pageIndex, pageSize });
        },
      }}
    />
  );
};

export default WorkforceAdjustmentTable;
