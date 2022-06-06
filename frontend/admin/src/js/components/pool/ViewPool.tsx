import * as React from "react";
import { useIntl } from "react-intl";
import { ViewGridIcon, HomeIcon } from "@heroicons/react/outline";

import Breadcrumbs from "@common/components/Breadcrumbs";
import type { BreadcrumbsProps } from "@common/components/Breadcrumbs";
import PageHeader from "@common/components/PageHeader";
import { Link } from "@common/components";
import { Tab, TabSet } from "@common/components/tabs";
import { commonMessages } from "@common/messages";
import { getLocale } from "@common/helpers/localize";

import Pending from "@common/components/Pending";
import NotFound from "@common/components/NotFound";
import { useAdminRoutes } from "../../adminRoutes";
import { useGetPoolQuery } from "../../api/generated";
import type { Pool } from "../../api/generated";
import DashboardContentContainer from "../DashboardContentContainer";

interface ViewPoolPageProps {
  pool: Pool;
}

export const ViewPoolPage: React.FC<ViewPoolPageProps> = ({ pool }) => {
  const intl = useIntl();
  const locale = getLocale(intl);
  const adminPaths = useAdminRoutes();

  const pageTitle = intl.formatMessage({
    defaultMessage: "Pool Details",
    description: "Title for the page when viewing an individual pool.",
  });

  const poolName = pool.name ? pool.name[locale] : pageTitle;

  const links = [
    {
      title: intl.formatMessage({
        defaultMessage: "Home",
        description: "Breadcrumb title for the home page link.",
      }),
      href: adminPaths.home(),
      icon: <HomeIcon style={{ width: "1rem", marginRight: "5px" }} />,
    },
    {
      title: intl.formatMessage({
        defaultMessage: "Pools",
        description: "Breadcrumb title for the pools page link.",
      }),
      href: adminPaths.poolTable(),
      icon: <ViewGridIcon style={{ width: "1rem", marginRight: "5px" }} />,
    },
    {
      title: poolName,
    },
  ] as BreadcrumbsProps["links"];

  return (
    <>
      <PageHeader icon={ViewGridIcon}>{pageTitle}</PageHeader>
      <Breadcrumbs links={links} />
      <div
        data-h2-align-items="b(center)"
        data-h2-display="b(flex)"
        data-h2-flex-direction="b(column) m(row)"
        data-h2-margin="b(top-bottom, l)"
      >
        {pool.name && (
          <h2
            data-h2-margin="b(top-bottom, s) m(top-bottom, none)"
            data-h2-font-weight="b(800)"
          >
            {poolName}
          </h2>
        )}
        <div data-h2-margin="m(left, auto)">
          <Link
            mode="outline"
            color="primary"
            type="button"
            href={adminPaths.poolUpdate(pool.id)}
          >
            {intl.formatMessage({
              defaultMessage: "Edit pool",
              description: "Link text for button to edit a specific pool",
            })}
          </Link>
        </div>
      </div>
      <TabSet>
        <Tab
          text={intl.formatMessage({
            defaultMessage: "Pool details",
            description: "Tabs title for the individual pool details.",
          })}
        />
        <Tab
          text={intl.formatMessage({
            defaultMessage: "Pool candidates",
            description: "Tabs title for the individual pool candidates.",
          })}
        />
      </TabSet>
    </>
  );
};

interface ViewPoolProps {
  poolId: string;
}

const ViewPool: React.FC<ViewPoolProps> = ({ poolId }) => {
  const intl = useIntl();
  const [{ data, fetching, error }] = useGetPoolQuery({
    variables: { id: poolId },
  });

  return (
    <Pending fetching={fetching} error={error}>
      {data?.pool ? (
        <ViewPoolPage pool={data.pool} />
      ) : (
        <NotFound headingMessage={intl.formatMessage(commonMessages.notFound)}>
          <p>
            {intl.formatMessage(
              {
                defaultMessage: "Pool {poolId} not found.",
                description: "Message displayed for pool not found.",
              },
              { poolId },
            )}
          </p>
        </NotFound>
      )}
    </Pending>
  );
};

export default ViewPool;
