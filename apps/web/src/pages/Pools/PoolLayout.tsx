import React from "react";
import { useIntl } from "react-intl";
import { Outlet } from "react-router-dom";
import { useQuery } from "urql";

import { Pending, Pill, ThrowNotFound } from "@gc-digital-talent/ui";
import { getLocalizedName } from "@gc-digital-talent/i18n";
import { graphql, Pool } from "@gc-digital-talent/graphql";

import SEO from "~/components/SEO/SEO";
import useCurrentPage from "~/hooks/useCurrentPage";
import {
  getAdvertisementStatus,
  getPoolCompletenessBadge,
  getShortPoolTitleLabel,
  useAdminPoolPages,
} from "~/utils/poolUtils";
import { PageNavKeys } from "~/types/pool";
import useRequiredParams from "~/hooks/useRequiredParams";
import AdminHero from "~/components/Hero/AdminHero";

interface PoolHeaderProps {
  pool: Pick<Pool, "id" | "classifications" | "stream" | "name" | "team">;
}

const PoolHeader = ({ pool }: PoolHeaderProps) => {
  const intl = useIntl();

  const pages = useAdminPoolPages(intl, pool);

  const poolTitle = getShortPoolTitleLabel(intl, pool);
  const currentPage = useCurrentPage<PageNavKeys>(pages);
  const subtitle = pool.team
    ? getLocalizedName(pool.team?.displayName, intl)
    : currentPage?.subtitle;

  const advertisementStatus = getAdvertisementStatus(pool);
  const advertisementBadge = getPoolCompletenessBadge(advertisementStatus);

  return (
    <>
      <SEO title={currentPage?.title} />
      <AdminHero
        title={poolTitle}
        subtitle={subtitle}
        nav={
          // Pages with crumbs are sub-pages and don't show up as tabs
          currentPage?.crumbs
            ? {
                mode: "crumbs",
                items: currentPage.crumbs,
              }
            : {
                mode: "subNav",
                items: Array.from(pages.values())
                  .filter((page) => !page.crumbs)
                  .map((page) => ({
                    label: page.link.label ?? page.title,
                    url: page.link.url,
                  })),
              }
        }
        contentRight={
          <Pill
            bold
            mode="outline"
            color={advertisementBadge.color}
            data-h2-flex-shrink="base(0)"
          >
            {intl.formatMessage(advertisementBadge.label)}
          </Pill>
        }
      />
    </>
  );
};

const PoolLayout_Query = graphql(/* GraphQL */ `
  query PoolLayout($poolId: UUID!) {
    pool(id: $poolId) {
      id
      name {
        en
        fr
      }
      stream
      classifications {
        id
        group
        level
      }
      publishedAt
      isComplete
      team {
        id
        name
        displayName {
          en
          fr
        }
      }
    }
  }
`);

type RouteParams = {
  poolId: string;
};

const PoolLayout = () => {
  const { poolId } = useRequiredParams<RouteParams>("poolId");
  const [{ data, fetching, error }] = useQuery({
    query: PoolLayout_Query,
    variables: {
      poolId,
    },
  });

  return (
    <>
      <Pending fetching={fetching} error={error}>
        {data?.pool ? <PoolHeader pool={data.pool} /> : <ThrowNotFound />}
      </Pending>
      <Outlet />
    </>
  );
};

export default PoolLayout;
