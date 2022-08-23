import * as React from "react";
import { useIntl } from "react-intl";
import { ViewGridIcon, HomeIcon } from "@heroicons/react/outline";

import Breadcrumbs from "@common/components/Breadcrumbs";
import type { BreadcrumbsProps } from "@common/components/Breadcrumbs";
import PageHeader from "@common/components/PageHeader";
import { Link } from "@common/components";
import {
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from "@common/components/Tabs";
import { commonMessages } from "@common/messages";
import { getLocale } from "@common/helpers/localize";

import Pending from "@common/components/Pending";
import NotFound from "@common/components/NotFound";
import { useAdminRoutes } from "../../../adminRoutes";
import { useGetPoolQuery } from "../../../api/generated";
import type { Pool } from "../../../api/generated";

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

  const tabs = [
    intl.formatMessage({
      defaultMessage: "Pool details",
      description: "Tabs title for the individual pool details.",
    }),
    intl.formatMessage({
      defaultMessage: "Pool candidates",
      description: "Tabs title for the individual pool candidates.",
    }),
  ];

  return (
    <>
      <PageHeader icon={ViewGridIcon}>{pageTitle}</PageHeader>
      <Breadcrumbs links={links} />
      <div
        data-h2-align-items="base(center)"
        data-h2-display="base(flex)"
        data-h2-flex-direction="base(column) l-tablet(row)"
        data-h2-margin="base(x2, 0)"
      >
        {pool.name && (
          <h2
            data-h2-margin="base(x.5, 0) p-tablet(0)"
            data-h2-font-weight="base(700)"
          >
            {poolName}
          </h2>
        )}
        <div data-h2-margin="l-tablet(0, 0, 0, auto)">
          <Link
            mode="outline"
            color="primary"
            type="button"
            href={adminPaths.poolEdit(pool.id)}
          >
            {intl.formatMessage({
              defaultMessage: "Edit pool",
              description: "Link text for button to edit a specific pool",
            })}
          </Link>
        </div>
      </div>
      <Tabs>
        <TabList>
          {tabs.map((tab, index) => (
            <Tab key={tab} index={index}>
              {tab}
            </Tab>
          ))}
        </TabList>
        <TabPanels>
          <TabPanel>{tabs[0]}</TabPanel>
          <TabPanel>{tabs[1]}</TabPanel>
        </TabPanels>
      </Tabs>
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
