import React from "react";
import { useIntl, defineMessage } from "react-intl";
import { Outlet } from "react-router-dom";

import { TableOfContents, Stepper } from "@gc-digital-talent/ui";

import SEO from "~/components/SEO/SEO";
import Hero from "~/components/Hero/Hero";

import useRoutes from "~/hooks/useRoutes";
import useCurrentPage from "~/hooks/useCurrentPage";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";

import { PageNavInfo } from "~/types/pages";
import {
  getFullPoolAdvertisementTitleHtml,
  getFullPoolAdvertisementTitleLabel,
} from "~/utils/poolUtils";

import ApplicationApi, { ApplicationPageProps } from "./ApplicationApi";
import { getPageInfo as welcomePageInfo } from "./ApplicationWelcomePage/ApplicationWelcomePage";
import { getPageInfo as profilePageInfo } from "./ApplicationProfilePage/ApplicationProfilePage";
import { getPageInfo as resumePageInfo } from "./ApplicationResumePage/ApplicationResumePage";
import { getPageInfo as educationPageInfo } from "./ApplicationEducationPage/ApplicationEducationPage";
import { getPageInfo as skillsPageInfo } from "./ApplicationSkillsPage/ApplicationSkillsPage";
import { getPageInfo as questionsPageInfo } from "./ApplicationQuestionsPage/ApplicationQuestionsPage";
import { getPageInfo as reviewPageInfo } from "./ApplicationReviewPage/ApplicationReviewPage";
import { getPageInfo as successPageInfo } from "./ApplicationSuccessPage/ApplicationSuccessPage";

type PageNavKey =
  | "welcome"
  | "profile"
  | "resume"
  | "education"
  | "skills"
  | "questions"
  | "review"
  | "success";

const deriveStepsFromPages = (pages: Map<PageNavKey, PageNavInfo>) => {
  const steps = Array.from(pages.values()).map((page) => ({
    label: page.link.label || page.title,
    href: page.link.url,
    icon: page.icon,
  }));

  steps.pop(); // We do not want to show final step in the stepper

  return steps;
};

const ApplicationPageWrapper = ({ application }: ApplicationPageProps) => {
  const intl = useIntl();
  const paths = useRoutes();

  const pages = new Map<PageNavKey, PageNavInfo>([
    ["welcome", welcomePageInfo({ paths, intl, application })],
    ["profile", profilePageInfo({ paths, intl, application })],
    ["resume", resumePageInfo({ paths, intl, application })],
    ["education", educationPageInfo({ paths, intl, application })],
    ["skills", skillsPageInfo({ paths, intl, application })],
    ["questions", questionsPageInfo({ paths, intl, application })],
    ["review", reviewPageInfo({ paths, intl, application })],
    ["success", successPageInfo({ paths, intl, application })],
  ]);

  const poolNameHtml = getFullPoolAdvertisementTitleHtml(
    intl,
    application.poolAdvertisement,
  );
  const poolName = getFullPoolAdvertisementTitleLabel(
    intl,
    application.poolAdvertisement,
  );
  const pageTitle = defineMessage({
    defaultMessage: "Apply to {poolName}",
    id: "K8CPir",
    description: "Heading for the application page",
  });

  const currentPage = useCurrentPage<PageNavKey>(pages);
  const currentCrumbs = currentPage?.crumbs || [];

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
      label: getFullPoolAdvertisementTitleHtml(
        intl,
        application.poolAdvertisement,
      ),
    },
    ...currentCrumbs,
  ]);

  const steps = deriveStepsFromPages(pages);
  const currentStep = Array.from(pages.keys()).findIndex((key) =>
    currentPage?.link.url.includes(key),
  );

  return (
    <>
      <SEO title={intl.formatMessage(pageTitle, { poolName })} />
      <Hero
        title={intl.formatMessage(pageTitle, { poolName: poolNameHtml })}
        crumbs={crumbs}
        subtitle={currentPage?.subtitle}
      />
      <div
        data-h2-container="base(center, large, x1) p-tablet(center, large, x2)"
        data-h2-margin-top="base(x2)"
      >
        <TableOfContents.Wrapper>
          <TableOfContents.Sidebar>
            <Stepper
              label={intl.formatMessage({
                defaultMessage: "Application steps",
                id: "y2Rl/m",
                description: "Label for the application stepper navigation",
              })}
              currentIndex={currentStep}
              steps={steps}
            />
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
