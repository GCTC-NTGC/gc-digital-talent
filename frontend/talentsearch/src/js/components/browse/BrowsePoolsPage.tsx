import React from "react";
import { useIntl } from "react-intl";
import { getLocale } from "@common/helpers/localize";
import Pending from "@common/components/Pending";

import NotFound from "@common/components/NotFound";
import { commonMessages } from "@common/messages";
import { useDirectIntakeRoutes } from "../../directIntakeRoutes";
import { useBrowsePoolsQuery } from "../../api/generated";
import type { Pool } from "../../api/generated";

interface BrowsePoolsProps {
  pools?: Array<Pick<Pool, "__typename" | "id" | "name">>;
}

const BrowsePools: React.FC<BrowsePoolsProps> = ({ pools }) => {
  const intl = useIntl();
  const locale = getLocale(intl);
  const paths = useDirectIntakeRoutes();
  return (
    <>
      <h1>
        {intl.formatMessage({
          defaultMessage: "Browse Pools",
          description: "Page title for the direct intake browse pools page.",
        })}
      </h1>
      {pools && pools.length ? (
        <ul>
          {pools.map((pool) => (
            <li key={pool.id}>
              <a href={paths.pool(pool.id)}>
                {pool.name ? pool.name[locale] : pool.id}
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <NotFound headingMessage={intl.formatMessage(commonMessages.notFound)}>
          <p>
            {intl.formatMessage({
              defaultMessage: "No pools found.",
              description:
                "Message displayed on the browse pools direct intake page when there are no pools.",
            })}
          </p>
        </NotFound>
      )}
    </>
  );
};

const BrowsePoolsApi: React.FC = () => {
  const [{ data, fetching, error }] = useBrowsePoolsQuery();

  const filteredPools = data?.pools.filter(
    (pool) => typeof pool !== undefined && !!pool,
  ) as Pool[];

  return (
    <Pending fetching={fetching} error={error}>
      <BrowsePools pools={filteredPools} />
    </Pending>
  );
};

export default BrowsePoolsApi;
