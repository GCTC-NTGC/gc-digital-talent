import { useIntl } from "react-intl";
import RectangleStackIcon from "@heroicons/react/24/outline/RectangleStackIcon";
import { useQuery } from "urql";

import {
  FragmentType,
  getFragment,
  graphql,
  Scalars,
} from "@gc-digital-talent/graphql";
import { Container, Heading, NotFound, Pending } from "@gc-digital-talent/ui";
import { unpackMaybes } from "@gc-digital-talent/helpers";
import { commonMessages } from "@gc-digital-talent/i18n";
import { ROLE_NAME } from "@gc-digital-talent/auth";

import ActivityLog from "~/components/Activity/ActivityLog";
import useRequiredParams from "~/hooks/useRequiredParams";
import RequireAuth from "~/components/RequireAuth/RequireAuth";
import { formatActivityDayGroup } from "~/components/Activity/utils";

const PoolActivity_Fragment = graphql(/** GraphQL */ `
  fragment PoolActivity on Pool {
    publishedAt
    activities {
      day
      items {
        id
        createdAt
        ...ActivityItem
      }
    }
  }
`);

interface PoolActivityProps {
  query: FragmentType<typeof PoolActivity_Fragment>;
}

const PoolActivity = ({ query }: PoolActivityProps) => {
  const intl = useIntl();
  const pool = getFragment(PoolActivity_Fragment, query);
  const activities = unpackMaybes(pool.activities).filter(
    (activity) => activity.items.length > 0,
  );

  return (
    <>
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

      {activities.length > 0 ? (
        <ActivityLog.Root>
          {activities.map((group) => (
            <ActivityLog.List
              key={group.day}
              heading={formatActivityDayGroup(group.day, intl)}
            >
              {group.items.map((item, index) => (
                <ActivityLog.PoolItem
                  key={item.id}
                  query={item}
                  border={index > 0}
                  publishedAt={pool.publishedAt}
                />
              ))}
            </ActivityLog.List>
          ))}
        </ActivityLog.Root>
      ) : (
        <ActivityLog.Empty />
      )}
    </>
  );
};

interface RouteParams extends Record<string, string> {
  poolId: Scalars["ID"]["output"];
}

const PoolActivityPage_Query = graphql(/* GraphQL */ `
  query PoolActivityPage($id: UUID!) {
    pool(id: $id) {
      ...PoolActivity
    }
  }
`);

const PoolActivityPage = () => {
  const intl = useIntl();
  const { poolId } = useRequiredParams<RouteParams>("poolId");
  const [{ data, fetching, error }] = useQuery({
    query: PoolActivityPage_Query,
    variables: { id: poolId },
  });

  return (
    <Container className="my-18">
      <Pending fetching={fetching} error={error}>
        {poolId && data?.pool ? (
          <PoolActivity query={data.pool} />
        ) : (
          <NotFound
            headingMessage={intl.formatMessage(commonMessages.notFound)}
          >
            <p>
              {intl.formatMessage(
                {
                  defaultMessage: "Pool {poolId} not found.",
                  id: "Sb2fEr",
                  description: "Message displayed for pool not found.",
                },
                { poolId },
              )}
            </p>
          </NotFound>
        )}
      </Pending>
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

export default PoolActivityPage;
