import React from "react";
import { useIntl } from "react-intl";
import { Outlet } from "react-router-dom";

import { TableOfContents } from "@gc-digital-talent/ui";

import SEO from "~/components/SEO/SEO";
import Hero from "~/components/Hero/Hero";

import useRoutes from "~/hooks/useRoutes";
import useCurrentPage from "~/hooks/useCurrentPage";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";

import { PageNavInfo } from "~/types/pages";
import { getFullPoolAdvertisementTitleHtml } from "~/utils/poolUtils";

import ApplicationApi, { ApplicationPageProps } from "./ApplicationApi";
import { getPageInfo as welcomePageInfo } from "./ApplicationWelcomePage/ApplicationWelcomePage";

type PageNavKey =
  | "welcome"
  | "profile"
  | "resume"
  | "education"
  | "skills"
  | "questions"
  | "submit";

const ApplicationPageWrapper = ({ application }: ApplicationPageProps) => {
  const intl = useIntl();
  const paths = useRoutes();

  const pages = new Map<PageNavKey, PageNavInfo>([
    ["welcome", welcomePageInfo({ paths, intl, application })],
  ]);

  const poolName = getFullPoolAdvertisementTitleHtml(
    intl,
    application.poolAdvertisement,
  );
  const currentPage = useCurrentPage<PageNavKey>(pages);

  const crumbs = useBreadcrumbs([
    {
      url: paths.browse(),
      label: intl.formatMessage({
        defaultMessage: "Browse IT Jobs",
        id: "l1fsXC",
        description: "Breadcrumb link text for the browse pools page",
      }),
    },
    {
      url: application.poolAdvertisement?.id
        ? paths.pool(application.poolAdvertisement.id)
        : "#",
      label: intl.formatMessage({
        defaultMessage: "Browse IT Jobs",
        id: "l1fsXC",
        description: "Breadcrumb link text for the browse pools page",
      }),
    },
    ...(currentPage?.crumb ? [currentPage?.crumb] : []),
  ]);

  return (
    <>
      <SEO title={currentPage?.title} />
      <Hero
        title={intl.formatMessage(
          {
            defaultMessage: "Apply to {poolName}",
            id: "K8CPir",
            description: "Heading for the application page",
          },
          { poolName },
        )}
        crumbs={crumbs}
        subtitle={currentPage?.subtitle}
      />
      <div data-h2-container="base(center, large, x1) p-tablet(center, large, x2)">
        <TableOfContents.Wrapper>
          <TableOfContents.Sidebar>
            <p>Stepper here</p>
          </TableOfContents.Sidebar>
          <TableOfContents.Content>
            <Outlet />
          </TableOfContents.Content>
        </TableOfContents.Wrapper>
      </div>
    </>
  );
};

const ApplicationLayout = () => (
  <ApplicationApi PageComponent={ApplicationPageWrapper} />
);

export default ApplicationLayout;
