import React from "react";
import { useIntl } from "react-intl";
import { useParams, Outlet, useLocation } from "react-router-dom";
import {
  ClipboardDocumentIcon,
  Cog8ToothIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";

import PageHeader from "@common/components/PageHeader";
import Pending from "@common/components/Pending";
import SEO from "@common/components/SEO/SEO";
import { ThrowNotFound } from "@common/components/NotFound";
import { getFullPoolAdvertisementTitleLabel } from "@common/helpers/poolUtils";

import useRoutes from "~/hooks/useRoutes";
import { useGetBasicPoolInfoQuery } from "~/api/generated";

const PoolPage = () => {
  const intl = useIntl();
  const paths = useRoutes();
  const { poolId } = useParams();
  const { pathname } = useLocation();
  const [{ data, fetching, error }] = useGetBasicPoolInfoQuery({
    variables: {
      poolId: poolId || "",
    },
  });

  const pages = new Map([
    [
      "view",
      {
        icon: ClipboardDocumentIcon,
        title: intl.formatMessage({
          defaultMessage: "Pool information",
          id: "Cjp2F6",
          description: "Title for the pool info page",
        }),
        linkText: null,
      },
    ],
    [
      "edit",
      {
        icon: Cog8ToothIcon,
        title: intl.formatMessage({
          defaultMessage: "Edit pool",
          id: "l7Wu86",
          description: "Title for the edit pool page",
        }),
        linkText: null,
      },
    ],
    [
      "candidates",
      {
        icon: UserGroupIcon,
        title: intl.formatMessage({
          defaultMessage: "Candidates",
          id: "X4TOhW",
          description: "Page title for the admin pool candidates index page",
        }),
        linkText: intl.formatMessage({
          defaultMessage: "View Candidates",
          id: "Rl+0Er",
          description: "Title for the edit pool page",
        }),
      },
    ],
  ]);

  /**
   * Once we move to loaders, this can be
   * computed by `useMatches`
   */
  let currentPage = pages.get("view");

  if (poolId && pathname === paths.poolCandidateTable(poolId)) {
    currentPage = pages.get("candidates");
  }

  if (poolId && pathname === paths.poolUpdate(poolId)) {
    currentPage = pages.get("edit");
  }

  const pool = data?.pool;
  const poolTitle = pool
    ? getFullPoolAdvertisementTitleLabel(intl, pool)
    : undefined;

  const navItems = [
    {
      url: paths.poolCandidateTable(pool?.id || poolId || ""),
      label: pages.get("candidates")?.linkText,
      icon: pages.get("candidates")?.icon,
    },
    {
      url: paths.poolView(pool?.id || poolId || ""),
      label: pages.get("view")?.title,
      icon: pages.get("view")?.icon,
    },
    {
      url: paths.poolUpdate(pool?.id || poolId || ""),
      label: pages.get("edit")?.title,
      icon: pages.get("edit")?.icon,
    },
  ];

  return (
    <Pending fetching={fetching} error={error}>
      {pool ? (
        <>
          <SEO title={poolTitle} />
          <PageHeader
            subtitle={poolTitle}
            icon={currentPage?.icon}
            navItems={navItems}
          >
            {currentPage?.title}
          </PageHeader>
        </>
      ) : (
        <ThrowNotFound
          message={intl.formatMessage(
            {
              defaultMessage: "Pool {poolId} not found.",
              id: "Sb2fEr",
              description: "Message displayed for pool not found.",
            },
            { poolId },
          )}
        />
      )}
      <Outlet />
    </Pending>
  );
};

export default PoolPage;
