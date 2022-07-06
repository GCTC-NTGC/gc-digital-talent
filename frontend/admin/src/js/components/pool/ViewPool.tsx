/* eslint-disable jsx-a11y/anchor-is-valid */
/* NOTE: This is temporary until we start the Candidates/Requests pages */
import * as React from "react";
import { useIntl } from "react-intl";
import {
  CogIcon,
  HomeIcon,
  TicketIcon,
  UserGroupIcon,
  ViewGridIcon,
} from "@heroicons/react/outline";

import Breadcrumbs from "@common/components/Breadcrumbs";
import type { BreadcrumbsProps } from "@common/components/Breadcrumbs";
import PageHeader from "@common/components/PageHeader";
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
import { IconLink } from "@common/components/Link";
import { useAdminRoutes } from "../../adminRoutes";
import { useGetPoolQuery } from "../../api/generated";
import type { Pool } from "../../api/generated";
import DashboardContentContainer from "../DashboardContentContainer";

interface ViewPoolPageProps {
  pool: Pool;
}

export const ViewPoolPage = ({ pool }: ViewPoolPageProps): JSX.Element => {
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
    <DashboardContentContainer>
      <PageHeader icon={ViewGridIcon}>{poolName}</PageHeader>
      <Breadcrumbs links={links} />
      <div
        data-h2-display="b(flex)"
        data-h2-flex-wrap="b(wrap)"
        data-h2-margin="b(top-bottom, m)"
      >
        <span data-h2-margin="b(bottom-right, s)">
          <IconLink
            mode="solid"
            color="secondary"
            type="button"
            href="#"
            icon={UserGroupIcon}
          >
            {intl.formatMessage({
              defaultMessage: "Manage candidates",
              description:
                "Link text for button to manage candidates of a specific pool",
            })}
          </IconLink>
        </span>
        <span data-h2-margin="b(bottom-right, s)">
          <IconLink
            mode="solid"
            color="secondary"
            type="button"
            href="#"
            icon={TicketIcon}
          >
            {intl.formatMessage({
              defaultMessage: "Manage requests",
              description:
                "Link text for button to manage requests of a specific pool",
            })}
          </IconLink>
        </span>
        <span data-h2-margin="b(bottom-right, s)">
          <IconLink
            mode="solid"
            color="secondary"
            type="button"
            href={adminPaths.poolUpdate(pool.id)}
            icon={CogIcon}
          >
            {intl.formatMessage({
              defaultMessage: "Edit pool advertisement",
              description: "Link text for button to edit a specific pool",
            })}
          </IconLink>
        </span>
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
    </DashboardContentContainer>
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
