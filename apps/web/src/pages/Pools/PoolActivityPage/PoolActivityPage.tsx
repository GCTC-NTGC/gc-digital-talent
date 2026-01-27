import { useIntl } from "react-intl";
import RectangleStackIcon from "@heroicons/react/24/outline/RectangleStackIcon";
import { useQuery } from "urql";
import { useSearchParams } from "react-router";
import { SubmitHandler } from "react-hook-form";

import { graphql, Maybe, Scalars } from "@gc-digital-talent/graphql";
import {
  Container,
  Heading,
  Loading,
  ThrowNotFound,
} from "@gc-digital-talent/ui";
import { unpackMaybes } from "@gc-digital-talent/helpers";
import { ROLE_NAME } from "@gc-digital-talent/auth";

import ActivityLog from "~/components/Activity/ActivityLog";
import useRequiredParams from "~/hooks/useRequiredParams";
import RequireAuth from "~/components/RequireAuth/RequireAuth";
import {
  formatActivityDayGroup,
  groupByDay,
} from "~/components/Activity/Items/utils";
import Pagination from "~/components/Pagination";
import { SEARCH_PARAM_KEY } from "~/components/Table/ResponsiveTable/constants";

import PoolActivityFilterDialog, {
  FormValues,
} from "./components/PoolActivityFilterDialog";
import {
  getTotalPages,
  safeGetFilters,
  safeGetPageState,
  transformWhereClause,
} from "./utils";

interface RouteParams extends Record<string, string> {
  poolId: Scalars["ID"]["output"];
}

const resetValues: FormValues = {
  events: undefined,
  candidates: undefined,
  causers: undefined,
};

const PoolActivityPage_Query = graphql(/* GraphQL */ `
  query PoolActivityPage(
    $id: UUID!
    $page: Int
    $first: Int!
    $where: ProcessActivityFilterInput
  ) {
    pool(id: $id) {
      publishedAt
      activities(
        first: $first
        page: $page
        where: $where
        orderBy: [{ column: "created_at", order: DESC }]
      ) {
        data {
          id
          createdAt
          ...ActivityItem
        }
        paginatorInfo {
          currentPage
          perPage
          total
        }
      }
    }
  }
`);

const PoolActivityPage = () => {
  const intl = useIntl();
  const { poolId } = useRequiredParams<RouteParams>("poolId");
  const [searchParams, setSearchParams] = useSearchParams();

  const searchTerm =
    searchParams.get(SEARCH_PARAM_KEY.SEARCH_TERM) ?? undefined;

  const pageSize = safeGetPageState(
    SEARCH_PARAM_KEY.PAGE_SIZE,
    searchParams,
    50,
  );
  const currentPage = safeGetPageState(SEARCH_PARAM_KEY.PAGE, searchParams, 1);
  const filters = safeGetFilters(searchParams);

  const [{ data, fetching }] = useQuery({
    query: PoolActivityPage_Query,
    variables: {
      id: poolId,
      first: pageSize,
      page: currentPage,
      where: transformWhereClause(searchTerm, filters),
    },
  });

  if (!data?.pool) {
    if (fetching) {
      return <Loading inline />;
    }

    return <ThrowNotFound />;
  }

  const totalItems = data?.pool?.activities.paginatorInfo.total;
  const totalPages = getTotalPages(totalItems, pageSize);

  const groups = groupByDay(unpackMaybes(data?.pool?.activities.data));

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set(SEARCH_PARAM_KEY.PAGE, String(page));
    setSearchParams(params);
  };

  const handlePageSizeChange = (size: number) => {
    const params = new URLSearchParams(searchParams);
    params.set(SEARCH_PARAM_KEY.PAGE_SIZE, String(size));
    const newTotalPages = getTotalPages(totalItems, size);
    if (currentPage > newTotalPages) {
      params.set(SEARCH_PARAM_KEY.PAGE, String(newTotalPages));
    }
    setSearchParams(params);
  };

  const handleSearch = (term?: Maybe<string>) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set(SEARCH_PARAM_KEY.SEARCH_TERM, term);
    } else {
      params.delete(SEARCH_PARAM_KEY.SEARCH_TERM);
    }
    params.delete(SEARCH_PARAM_KEY.PAGE);

    setSearchParams(params);
  };

  const handleResetSearch = () => {
    const params = new URLSearchParams(searchParams);
    params.delete(SEARCH_PARAM_KEY.SEARCH_TERM);
    params.delete(SEARCH_PARAM_KEY.PAGE);

    setSearchParams(params);
  };

  const handleFilterChange: SubmitHandler<FormValues> = (values) => {
    const params = new URLSearchParams(searchParams);
    params.delete(SEARCH_PARAM_KEY.PAGE);

    if (Object.values(values).some((val) => typeof val !== "undefined")) {
      const encodedFilters = encodeURIComponent(JSON.stringify(values));
      params.set(SEARCH_PARAM_KEY.FILTERS, encodedFilters);
    } else {
      params.delete(SEARCH_PARAM_KEY.FILTERS);
    }

    setSearchParams(params);
  };

  return (
    <Container className="my-18">
      <Heading
        level="h2"
        icon={RectangleStackIcon}
        className="mt-0 mb-6"
        color="secondary"
      >
        {intl.formatMessage({
          defaultMessage: "Activity log",
          id: "SxjOxL",
          description: "Heading for the activity log for some resource",
        })}
      </Heading>

      <div className="my-6 flex items-end gap-3">
        <ActivityLog.SearchForm
          onReset={handleResetSearch}
          onSearch={handleSearch}
          defaultValue={searchParams.get(SEARCH_PARAM_KEY.SEARCH_TERM)}
        />
        <div className="shrink">
          <PoolActivityFilterDialog
            key={filters ? JSON.stringify(filters) : "empty"}
            onSubmit={handleFilterChange}
            initialValues={filters}
            resetValues={resetValues}
          />
        </div>
      </div>

      <div className="relative">
        {fetching && <Loading className="absolute" />}
        {groups.length > 0 ? (
          <>
            <ActivityLog.Root className="mb-6">
              {groups.map((group) => (
                <ActivityLog.List
                  key={group.day}
                  heading={formatActivityDayGroup(group.day, intl)}
                >
                  {group.activities.map((item) => (
                    <ActivityLog.Item
                      key={item.id}
                      query={item}
                      itemProps={{ publishedAt: data?.pool?.publishedAt }}
                    />
                  ))}
                </ActivityLog.List>
              ))}
            </ActivityLog.Root>
            <Pagination
              color="black"
              ariaLabel={intl.formatMessage({
                defaultMessage: "Process activity page navigation",
                id: "I7qIfR",
                description: "Label for activity pagination",
              })}
              currentPage={currentPage}
              pageSize={pageSize}
              totalPages={totalPages}
              totalCount={totalItems}
              onCurrentPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
              pageSizes={[50, 100, 500]}
            />
          </>
        ) : (
          <ActivityLog.Empty />
        )}
      </div>
    </Container>
  );
};

export const Component = () => (
  <RequireAuth
    roles={[
      ROLE_NAME.PlatformAdmin,
      ROLE_NAME.CommunityRecruiter,
      ROLE_NAME.ProcessOperator,
    ]}
  >
    <PoolActivityPage />
  </RequireAuth>
);

Component.displayName = "AdminPoolActivityPage";

export default Component;
