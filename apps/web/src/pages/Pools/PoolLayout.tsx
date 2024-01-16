import React from "react";
import { useIntl } from "react-intl";
import { Outlet } from "react-router-dom";
import { useQuery } from "urql";

import { Pending, ThrowNotFound } from "@gc-digital-talent/ui";
import { graphql } from "@gc-digital-talent/graphql";

import SEO from "~/components/SEO/SEO";
import useCurrentPage from "~/hooks/useCurrentPage";
import { Pool } from "~/api/generated";
import { getFullPoolTitleLabel, useAdminPoolPages } from "~/utils/poolUtils";
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
