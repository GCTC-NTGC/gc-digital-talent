import React from "react";
import { useIntl, defineMessage } from "react-intl";
import { Outlet, useParams } from "react-router-dom";

import { TableOfContents, Stepper } from "@gc-digital-talent/ui";

import SEO from "~/components/SEO/SEO";
import Hero from "~/components/Hero/Hero";

import useRoutes from "~/hooks/useRoutes";
import useCurrentPage from "~/hooks/useCurrentPage";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";

import { ApplicationPageInfo } from "~/types/poolCandidate";
import {
  getFullPoolAdvertisementTitleHtml,
  getFullPoolAdvertisementTitleLabel,
} from "~/utils/poolUtils";

import ApplicationApi, { ApplicationPageProps } from "./ApplicationApi";
import { getPageInfo as welcomePageInfo } from "./ApplicationWelcomePage/ApplicationWelcomePage";
import { getPageInfo as profilePageInfo } from "./ApplicationProfilePage/ApplicationProfilePage";
import { getPageInfo as resumeIntroductionPageInfo } from "./ApplicationResumeIntroductionPage/ApplicationResumeIntroductionPage";
import { getPageInfo as resumeAddPageInfo } from "./ApplicationResumeAddPage/ApplicationResumeAddPage";
import { getPageInfo as resumeEditPageInfo } from "./ApplicationResumeEditPage/ApplicationResumeEditPage";
import { getPageInfo as resumePageInfo } from "./ApplicationResumePage/ApplicationResumePage";
import { getPageInfo as educationPageInfo } from "./ApplicationEducationPage/ApplicationEducationPage";
import { getPageInfo as skillsIntroductionPageInfo } from "./ApplicationSkillsIntroductionPage/ApplicationSkillsIntroductionPage";
import { getPageInfo as skillsPageInfo } from "./ApplicationSkillsPage/ApplicationSkillsPage";
import { getPageInfo as questionsIntroductionPageInfo } from "./ApplicationQuestionsIntroductionPage/ApplicationQuestionsIntroductionPage";
import { getPageInfo as questionsPageInfo } from "./ApplicationQuestionsPage/ApplicationQuestionsPage";
import { getPageInfo as reviewPageInfo } from "./ApplicationReviewPage/ApplicationReviewPage";
import { getPageInfo as successPageInfo } from "./ApplicationSuccessPage/ApplicationSuccessPage";

type PageNavKey =
  | "welcome"
  | "profile"
  | "resume-intro"
  | "resume-add"
  | "resume-edit"
  | "resume"
  | "education"
  | "skills-intro"
  | "skills"
  | "questions-intro"
  | "questions"
  | "review"
  | "success";

const deriveStepsFromPages = (pages: Map<PageNavKey, ApplicationPageInfo>) => {
  const steps = Array.from(pages.values())
    .filter((page) => !page.omitFromStepper) // Hide some pages from stepper
    .map((page) => ({
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
  const { experienceId } = useParams();

  const pages = new Map<PageNavKey, ApplicationPageInfo>([
    ["welcome", welcomePageInfo({ paths, intl, application })],
    ["profile", profilePageInfo({ paths, intl, application })],
    ["resume-intro", resumeIntroductionPageInfo({ paths, intl, application })],
    ["resume-add", resumeAddPageInfo({ paths, intl, application })],
    [
      "resume-edit",
      resumeEditPageInfo({
        paths,
        intl,
        application,
        resourceId: experienceId,
      }),
    ],
    ["resume", resumePageInfo({ paths, intl, application })],
    ["education", educationPageInfo({ paths, intl, application })],
    ["skills-intro", skillsIntroductionPageInfo({ paths, intl, application })],
    ["skills", skillsPageInfo({ paths, intl, application })],
    [
      "questions-intro",
      questionsIntroductionPageInfo({ paths, intl, application }),
    ],
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

  const currentPage = useCurrentPage(pages);
  const currentCrumbs = currentPage?.crumbs || [];
  const steps = deriveStepsFromPages(pages);
  const currentStep = steps.findIndex((step) =>
    currentPage?.link.url.includes(step.href),
  );

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
              preventDisable
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
