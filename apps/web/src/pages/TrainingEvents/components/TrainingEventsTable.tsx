import { useQuery } from "urql";
import { ReactNode, useMemo, useState } from "react";
import {
  ColumnDef,
  createColumnHelper,
  PaginationState,
  SortingState,
} from "@tanstack/react-table";
import { useIntl } from "react-intl";
import { useLocation } from "react-router-dom";

import {
  DeadlineStatus,
  graphql,
  OrderByClause,
  SortOrder,
  TrainingOpportunitiesFilterInput,
  TrainingOpportunity,
} from "@gc-digital-talent/graphql";
import { notEmpty } from "@gc-digital-talent/helpers";
import {
  commonMessages,
  getLocale,
  getLocalizedName,
  Locales,
} from "@gc-digital-talent/i18n";
import { Chip, ChipProps, Link } from "@gc-digital-talent/ui";

import Table, {
  getTableStateFromSearchParams,
} from "~/components/Table/ResponsiveTable/ResponsiveTable";
import { InitialState } from "~/components/Table/ResponsiveTable/types";
import adminMessages from "~/messages/adminMessages";
import useRoutes from "~/hooks/useRoutes";

import formLabels from "../formLabels";

const columnHelper = createColumnHelper<TrainingOpportunity>();

const INITIAL_STATE: InitialState = {
  hiddenColumnIds: [],
  paginationState: {
    pageIndex: 0,
    pageSize: 10,
  },
  sortState: [],
  searchState: {},
};

const defaultState = {
  ...INITIAL_STATE,
  sortState: [{ id: "name", desc: false }],
  filters: {},
};

function transformSortStateToOrderByClause(
  locale: Locales,
  sortingRule?: SortingState,
): OrderByClause | OrderByClause[] | undefined {
  const columnMap = new Map<string, string>([
    ["name", `title->${locale}`],
    ["language", "course_language"],
    ["status", "registration_deadline"], // deadline status is not a real column, but storting by deadline achieves the same thing
    ["registrationDeadline", "registration_deadline"],
    ["trainingStartDate", "training_start"],
    ["trainingEndDate", "training_end"],
  ]);

  const orderBy = sortingRule
    ?.map((rule) => {
      const columnName = columnMap.get(rule.id);
      if (!columnName) return undefined;
      return {
        column: columnName,
        order: rule.desc ? SortOrder.Desc : SortOrder.Asc,
      };
    })
    .filter(notEmpty);

  return orderBy?.length ? orderBy : undefined;
}

const TrainingEventsPaginated_Query = graphql(/* GraphQL */ `
  query TrainingEventsPaginated(
    $first: Int
    $page: Int
    $orderBy: [OrderByClause!]
  ) {
    trainingOpportunitiesPaginated(
      first: $first
      page: $page
      orderBy: $orderBy
    ) {
      data {
        id
        title {
          en
          fr
        }
        courseLanguage {
          value
          label {
            en
            fr
          }
        }
        registrationDeadline
        registrationDeadlineStatus {
          value
          label {
            en
            fr
          }
        }
        trainingStart
        trainingEnd
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

interface TrainingEventsTableProps {
  title: ReactNode;
}

export const TrainingEventsTable = ({ title }: TrainingEventsTableProps) => {
  const intl = useIntl();
  const locale = getLocale(intl);
  const paths = useRoutes();
  const initialState = getTableStateFromSearchParams(defaultState);

  const { pathname, search, hash } = useLocation();
  const currentUrl = `${pathname}${search}${hash}`;

  const [paginationState, setPaginationState] = useState<PaginationState>(
    initialState.paginationState
      ? {
          ...initialState.paginationState,
          pageIndex: initialState.paginationState.pageIndex + 1,
        }
      : INITIAL_STATE.paginationState,
  );
  const [sortState, setSortState] = useState<SortingState | undefined>(
    initialState.sortState ?? [{ id: "title", desc: false }],
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

  const statusChipStyles: Record<DeadlineStatus, ChipProps["color"]> = {
    PUBLISHED: "primary",
    EXPIRED: "black",
  } as const;

  const columns = [
    columnHelper.accessor((event) => getLocalizedName(event.title, intl), {
      id: "name",
      header: intl.formatMessage(commonMessages.name),
      cell: ({ row: { original: event } }) =>
        event.id ? (
          <Link
            href={paths.trainingEventView(event.id)}
            data-h2-font-weight="base(700)"
          >
            {getLocalizedName(event.title, intl)}
          </Link>
        ) : (
          getLocalizedName(event.title, intl)
        ),
      meta: {
        isRowTitle: true,
      },
    }),
    columnHelper.accessor((event) => (event.courseLanguage?.label, intl), {
      id: "language",
      header: intl.formatMessage(commonMessages.language),
      cell: ({ row: { original: event } }) =>
        getLocalizedName(event.courseLanguage?.label, intl),
    }),
    columnHelper.accessor((event) => event.registrationDeadlineStatus, {
      id: "status",
      header: intl.formatMessage(commonMessages.status),
      cell: ({ row: { original: event } }) =>
        event.registrationDeadlineStatus?.value ? (
          <Chip
            color={statusChipStyles[event.registrationDeadlineStatus.value]}
          >
            {getLocalizedName(event.registrationDeadlineStatus?.label, intl)}
          </Chip>
        ) : (
          intl.formatMessage(adminMessages.noneProvided)
        ),
    }),
    columnHelper.accessor((event) => (event.registrationDeadline, intl), {
      id: "registrationDeadline",
      header: intl.formatMessage(formLabels.registrationDeadline),
      cell: ({ row: { original: event } }) => event.registrationDeadline,
    }),
    columnHelper.accessor((event) => (event.trainingStart, intl), {
      id: "trainingStartDate",
      header: intl.formatMessage(formLabels.trainingStartDate),
      cell: ({ row: { original: event } }) => event.trainingStart,
    }),
    columnHelper.accessor((event) => (event.trainingEnd, intl), {
      id: "trainingEndDate",
      header: intl.formatMessage(formLabels.trainingEndDate),
      cell: ({ row: { original: event } }) =>
        event.trainingEnd ?? intl.formatMessage(adminMessages.noneProvided),
    }),
  ] as ColumnDef<TrainingOpportunity>[];

  const [{ data, fetching }] = useQuery({
    query: TrainingEventsPaginated_Query,
    variables: {
      page: paginationState.pageIndex,
      first: paginationState.pageSize,
      orderBy: sortState
        ? transformSortStateToOrderByClause(locale, sortState)
        : undefined,
    },
  });

  const filteredData: TrainingOpportunity[] = useMemo(() => {
    const opportunities = data?.trainingOpportunitiesPaginated?.data ?? [];
    return opportunities.filter(notEmpty);
  }, [data?.trainingOpportunitiesPaginated?.data]);

  return (
    <Table<TrainingOpportunity, TrainingOpportunitiesFilterInput>
      data={filteredData}
      caption={title}
      columns={columns}
      isLoading={fetching}
      pagination={{
        internal: false,
        initialState: INITIAL_STATE.paginationState,
        state: paginationState,
        total: data?.trainingOpportunitiesPaginated?.paginatorInfo.total,
        pageSizes: [10, 20, 50],
        onPaginationChange: ({ pageIndex, pageSize }: PaginationState) => {
          handlePaginationStateChange({ pageIndex, pageSize });
        },
      }}
      sort={{
        internal: false,
        onSortChange: setSortState,
        initialState: defaultState.sortState,
      }}
      add={{
        linkProps: {
          href: paths.trainingEventCreate(),
          label: intl.formatMessage({
            defaultMessage: "Create an event",
            id: "bWUOmk",
            description: "Title for link to page to create a training event",
          }),
          from: currentUrl,
        },
      }}
    />
  );
};

export default TrainingEventsTable;
