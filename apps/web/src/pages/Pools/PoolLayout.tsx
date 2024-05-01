import React from "react";
import { useIntl } from "react-intl";
import { Outlet } from "react-router-dom";
import { useQuery } from "urql";

import {
  Pending,
  Chip,
  ThrowNotFound,
  useAnnouncer,
} from "@gc-digital-talent/ui";
import { getLocalizedName } from "@gc-digital-talent/i18n";
import { FragmentType, getFragment, graphql } from "@gc-digital-talent/graphql";

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

export const PoolLayout_Fragment = graphql(/* GraphQL */ `
  fragment PoolLayout on Pool {
    id
    stream
    publishedAt
    isComplete
    name {
      en
      fr
    }
    team {
      id
      name
      displayName {
        en
        fr
      }
    }
    classification {
      id
      group
      level
      name {
        en
        fr
      }
    }
  }
`);

interface PoolHeaderProps {
  poolQuery: FragmentType<typeof PoolLayout_Fragment>;
}

const PoolHeader = ({ poolQuery }: PoolHeaderProps) => {
  const intl = useIntl();
  const { announce } = useAnnouncer();
  const pool = getFragment(PoolLayout_Fragment, poolQuery);

  const pages = useAdminPoolPages(intl, pool);

  const poolTitle = getShortPoolTitleLabel(intl, pool);
  const currentPage = useCurrentPage<PageNavKeys>(pages);
  const subTitle = pool.team
    ? getLocalizedName(pool.team?.displayName, intl)
    : currentPage?.subtitle;

  const advertisementStatus = getAdvertisementStatus(pool);
  const advertisementBadge = getPoolCompletenessBadge(advertisementStatus);

  React.useEffect(() => {
    if (currentPage?.title) {
      announce(currentPage?.title);
    }
  }, [announce, currentPage?.title, intl]);

  return (
    <>
      <SEO title={currentPage?.title} description={subTitle} />
      <AdminHero
        title={poolTitle}
        subtitle={subTitle}
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
          (currentPage?.link.url.includes("edit") ||
            currentPage?.link.url.includes("plan")) && (
            <Chip
              color={advertisementBadge.color}
              data-h2-flex-shrink="base(0)"
            >
              {intl.formatMessage(advertisementBadge.label)}
            </Chip>
          )
        }
      />
    </>
  );
};

const PoolLayout_Query = graphql(/* GraphQL */ `
  query PoolLayout($poolId: UUID!) {
    pool(id: $poolId) {
      ...PoolLayout
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
        {data?.pool ? <PoolHeader poolQuery={data.pool} /> : <ThrowNotFound />}
      </Pending>
      <Outlet />
    </>
  );
};

export default PoolLayout;
