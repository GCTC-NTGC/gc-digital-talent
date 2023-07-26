import React from "react";
import { useIntl, defineMessage } from "react-intl";
import { Outlet, useParams, useNavigate } from "react-router-dom";
import flatMap from "lodash/flatMap";

import {
  TableOfContents,
  Stepper,
  Pending,
  ThrowNotFound,
} from "@gc-digital-talent/ui";
import { empty, notEmpty } from "@gc-digital-talent/helpers";

import SEO from "~/components/SEO/SEO";
import Hero from "~/components/Hero/Hero";
import IapContactDialog from "~/components/Dialog/IapContactDialog";

import useRoutes from "~/hooks/useRoutes";
import useCurrentPage from "~/hooks/useCurrentPage";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";

import { fullPoolTitle, isIAPPool } from "~/utils/poolUtils";
import { useGetApplicationQuery } from "~/api/generated";
import {
  applicationStepsToStepperArgs,
  getApplicationSteps,
  getNextStepToSubmit,
  isOnDisabledPage,
} from "~/utils/applicationUtils";

import { ApplicationPageProps } from "./ApplicationApi";
import StepDisabledPage from "./StepDisabledPage/StepDisabledPage";
import ApplicationContextProvider from "./ApplicationContext";

const ApplicationPageWrapper = ({ application }: ApplicationPageProps) => {
  const intl = useIntl();
  const paths = useRoutes();
  const navigate = useNavigate();
  const { experienceId } = useParams();
  const steps = getApplicationSteps({
    intl,
    paths,
    application,
    experienceId,
  });
  const title = fullPoolTitle(intl, application.pool);
  const isIAP = isIAPPool(application.pool);

  const pageTitle = defineMessage({
    defaultMessage: "Apply to {poolName}",
    id: "K8CPir",
    description: "Heading for the application page",
  });

  const pages = flatMap(steps, (step) => [
    step.mainPage,
    step.introductionPage,
    ...(step.auxiliaryPages ?? []),
  ]).filter(notEmpty);

  const currentPage = useCurrentPage(pages);
  const currentCrumbs = currentPage?.crumbs || [];

  const currentStepIndex = steps.findIndex(
    (step) =>
      step.mainPage.link.url === currentPage?.link.url ||
      step.introductionPage?.link.url === currentPage?.link.url ||
      step.auxiliaryPages?.some(
        (auxPage) => auxPage.link.url === currentPage?.link?.url,
      ),
  );
  const nextStepToSubmit = getNextStepToSubmit(
    steps,
    application.submittedSteps,
  );
  const followingStep =
    currentStepIndex < steps.length - 1 ? steps[currentStepIndex + 1] : null;

  const crumbs = useBreadcrumbs([
    {
      url: paths.browsePools(),
      label: intl.formatMessage({
        defaultMessage: "Browse jobs",
        id: "WtX9b3",
        description: "Breadcrumb link text for the browse pools page",
      }),
    },
    {
      url: paths.pool(application.pool.id),
      label: title.html,
    },
    ...currentCrumbs,
  ]);

  const userIsOnDisabledPage = isOnDisabledPage(
    currentPage?.link.url,
    steps,
    application.submittedSteps,
  );

  // If we cannot find the current page, redirect to the first step
  // that has not been submitted yet, or the last step
  React.useEffect(() => {
    if (empty(currentPage)) {
      navigate(nextStepToSubmit.mainPage.link.url, {
        replace: true,
      });
    }
  }, [currentPage, navigate, nextStepToSubmit]);

  return (
    <ApplicationContextProvider
      application={application}
      followingPageUrl={
        followingStep?.introductionPage?.link.url ??
        followingStep?.mainPage.link.url
      }
      currentStepOrdinal={currentStepIndex + 1}
    >
      <SEO title={intl.formatMessage(pageTitle, { poolName: title.label })} />
      <Hero
        title={intl.formatMessage(pageTitle, { poolName: title.html })}
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
              currentIndex={currentStepIndex}
              steps={applicationStepsToStepperArgs(steps, application)}
            />
            {isIAP && (
              <div data-h2-margin="base(x1 0)">
                <IapContactDialog />
              </div>
            )}
          </TableOfContents.Sidebar>
          <TableOfContents.Content>
            {userIsOnDisabledPage ? (
              <StepDisabledPage
                returnUrl={nextStepToSubmit.mainPage.link.url}
              />
            ) : (
              <Outlet />
            )}
          </TableOfContents.Content>
        </TableOfContents.Wrapper>
      </div>
    </ApplicationContextProvider>
  );
};

const ApplicationLayout = () => {
  const { applicationId } = useParams();
  const [{ data, fetching, error, stale }] = useGetApplicationQuery({
    requestPolicy: "cache-first",
    variables: {
      id: applicationId || "",
    },
  });

  const application = data?.poolCandidate;

  return (
    <Pending fetching={fetching || stale} error={error}>
      {application ? (
        <ApplicationContextProvider application={application}>
          <ApplicationPageWrapper application={application} />
        </ApplicationContextProvider>
      ) : (
        <ThrowNotFound />
      )}
    </Pending>
  );
};

export default ApplicationLayout;
