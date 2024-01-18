import React from "react";
import { useIntl } from "react-intl";
import { Outlet } from "react-router-dom";

import { Pending, Pill, ThrowNotFound } from "@gc-digital-talent/ui";

import SEO from "~/components/SEO/SEO";
import useCurrentPage from "~/hooks/useCurrentPage";
import { Pool, useGetBasicPoolInfoQuery } from "~/api/generated";
import {
  getAdvertisementStatus,
  getFullPoolTitleLabel,
  getPoolCompletenessBadge,
  useAdminPoolPages,
} from "~/utils/poolUtils";
import { PageNavKeys } from "~/types/pool";
import useRequiredParams from "~/hooks/useRequiredParams";
import AdminHero from "~/components/Hero/AdminHero";

interface PoolHeaderProps {
  pool: Pick<Pool, "id" | "classifications" | "stream" | "name">;
}

const PoolHeader = ({ pool }: PoolHeaderProps) => {
  const intl = useIntl();

  const pages = useAdminPoolPages(intl, pool);

  const poolTitle = getFullPoolTitleLabel(intl, pool);
  const currentPage = useCurrentPage<PageNavKeys>(pages);

  const advertisementStatus = getAdvertisementStatus(pool);
  const advertisementBadge = getPoolCompletenessBadge(advertisementStatus);

  return (
    <>
      <SEO title={currentPage?.title} />
      <AdminHero
        title={poolTitle}
        subtitle={currentPage?.subtitle}
        nav={{
          mode: "subNav",
          items: Array.from(pages.values()).map((page) => ({
            label: page.link.label ?? page.title,
            url: page.link.url,
          })),
        }}
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

type RouteParams = {
  poolId: string;
};

const PoolLayout = () => {
  const { poolId } = useRequiredParams<RouteParams>("poolId");
  const [{ data, fetching, error }] = useGetBasicPoolInfoQuery({
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
