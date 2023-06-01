import React from "react";
import { useIntl } from "react-intl";
import { useParams, Outlet } from "react-router-dom";

import { Pending, ThrowNotFound } from "@gc-digital-talent/ui";

import PageHeader from "~/components/PageHeader";
import SEO from "~/components/SEO/SEO";
import useCurrentPage from "~/hooks/useCurrentPage";
import { Pool, useGetBasicPoolInfoQuery } from "~/api/generated";
import { getFullPoolTitleLabel, useAdminPoolPages } from "~/utils/poolUtils";
import { PageNavKeys } from "~/types/pool";

interface PoolHeaderProps {
  pool: Pick<Pool, "id" | "classifications" | "stream" | "name">;
}

const PoolHeader = ({ pool }: PoolHeaderProps) => {
  const intl = useIntl();

  const pages = useAdminPoolPages(intl, pool);

  const poolTitle = getFullPoolTitleLabel(intl, pool);
  const currentPage = useCurrentPage<PageNavKeys>(pages);

  return (
    <>
      <SEO title={currentPage?.title} />
      <PageHeader
        subtitle={poolTitle}
        icon={currentPage?.icon}
        navItems={pages}
      >
        {currentPage?.title}
      </PageHeader>
    </>
  );
};

const PoolLayout = () => {
  const { poolId } = useParams();
  const [{ data, fetching, error }] = useGetBasicPoolInfoQuery({
    variables: {
      poolId: poolId || "",
    },
  });

  return (
    <>
      {/* This is above the AdminContentWrapper so it needs its own centering */}
      <div data-h2-container="base(center, full, x2)">
        <Pending fetching={fetching} error={error}>
          {data?.pool ? <PoolHeader pool={data.pool} /> : <ThrowNotFound />}
        </Pending>
      </div>
      <Outlet />
    </>
  );
};

export default PoolLayout;
