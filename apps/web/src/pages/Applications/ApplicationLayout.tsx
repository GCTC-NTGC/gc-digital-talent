import React from "react";
import { useIntl, defineMessage } from "react-intl";
import { Outlet, useParams } from "react-router-dom";

import {
  TableOfContents,
  Stepper,
  Pending,
  ThrowNotFound,
} from "@gc-digital-talent/ui";

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
import {
  ApplicationStep,
  Maybe,
  useGetBasicApplicationInfoQuery,
} from "~/api/generated";

import { ApplicationPageProps } from "./ApplicationApi";
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
import { StepDisabledPage } from "./StepDisabledPage/StepDisabledPage";

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

const deriveSteps = (
  pages: Map<PageNavKey, ApplicationPageInfo>,
  submittedSteps: Maybe<Array<ApplicationStep>>,
) => {
  const steps = Array.from(pages.values())
    .filter((page) => !page.omitFromStepper) // Hide some pages from stepper
    .map((page) => ({
      label: page.link.label || page.title,
      href: page.link.url,
      icon: page.icon,
      completed:
        (page.stepSubmitted && submittedSteps?.includes(page.stepSubmitted)) ??
        false,
    }));

  steps.pop(); // We do not want to show final step in the stepper

  return steps;
};

// check if the current page should be disabled and figure out where to return the user to
function checkForDisabledPage(
  currentPageUrl: string | undefined,
  pages: Map<PageNavKey, ApplicationPageInfo>,
  submittedSteps: Maybe<ApplicationStep[]>,
): { isOnDisabledPage: boolean; urlToReturnTo?: string } {
  // copied from useCurrentPage, but I need the full ApplicationPageInfo
  const pagesArray = Array.from(pages.values());
  const currentPageInfo = pagesArray.find(
    (page) => page.link.url === currentPageUrl,
  );
  const missingPrerequisites = currentPageInfo?.prerequisites.filter(
    (currentPagePrerequisite) =>
      !submittedSteps?.includes(currentPagePrerequisite),
  );
  if (!missingPrerequisites?.length) {
    // yay, nothing missing!
    return { isOnDisabledPage: false };
  }

  // go back to the first missing page
  const firstMissingPrerequisite = missingPrerequisites[0];
  const pageForFirstMissingPrerequisite = pagesArray.find((p) => {
    return p.stepSubmitted === firstMissingPrerequisite;
  });
  return {
    isOnDisabledPage: true,
    urlToReturnTo: pageForFirstMissingPrerequisite?.link.url,
  };
}

const ApplicationPageWrapper = ({ application }: ApplicationPageProps) => {
  const intl = useIntl();
  const paths = useRoutes();
  const { experienceId } = useParams();

  const pages = new Map<PageNavKey, ApplicationPageInfo>([
    ["welcome", welcomePageInfo({ paths, intl, application })],
    ["profile", profilePageInfo({ paths, intl, application })],
    ["resume", resumePageInfo({ paths, intl, application })],
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
    ["education", educationPageInfo({ paths, intl, application })],
    ["skills", skillsPageInfo({ paths, intl, application })],
    ["skills-intro", skillsIntroductionPageInfo({ paths, intl, application })],
    ["questions", questionsPageInfo({ paths, intl, application })],
    [
      "questions-intro",
      questionsIntroductionPageInfo({ paths, intl, application }),
    ],
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
  const steps = deriveSteps(pages, application.submittedSteps);
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

  const { isOnDisabledPage, urlToReturnTo } = checkForDisabledPage(
    currentPage?.link.url,
    pages,
    application.submittedSteps,
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
            {isOnDisabledPage ? (
              <StepDisabledPage returnUrl={urlToReturnTo} />
            ) : (
              <Outlet />
            )}
          </TableOfContents.Content>
        </TableOfContents.Wrapper>
      </div>
    </>
  );
};

const ApplicationLayout = () => {
  const { applicationId } = useParams();
  const [{ data, fetching, error }] = useGetBasicApplicationInfoQuery({
    requestPolicy: "cache-first",
    variables: {
      id: applicationId || "",
    },
  });

  const application = data?.poolCandidate;

  return (
    <Pending fetching={fetching} error={error}>
      {application?.poolAdvertisement ? (
        <ApplicationPageWrapper application={application} />
      ) : (
        <ThrowNotFound />
      )}
    </Pending>
  );
};

export default ApplicationLayout;
