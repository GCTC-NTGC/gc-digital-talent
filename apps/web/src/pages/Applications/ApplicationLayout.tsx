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

import useRoutes from "~/hooks/useRoutes";
import useCurrentPage from "~/hooks/useCurrentPage";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";

import {
  getFullPoolAdvertisementTitleHtml,
  getFullPoolAdvertisementTitleLabel,
} from "~/utils/poolUtils";
import { useGetApplicationQuery } from "~/api/generated";
import {
  checkForDisabledPage,
  getApplicationSteps,
  getNextNonSubmittedStep,
  missingPrerequisites,
} from "~/utils/applicationUtils";

import { ApplicationPageProps } from "./ApplicationApi";
import { StepDisabledPage } from "./StepDisabledPage/StepDisabledPage";
import ApplicationContextProvider from "./ApplicationContext";

const ApplicationPageWrapper = ({ application }: ApplicationPageProps) => {
  const intl = useIntl();
  const paths = useRoutes();
  const navigate = useNavigate();
  const steps = getApplicationSteps({
    intl,
    paths,
    application,
    poolAdvertisement: application.poolAdvertisement,
  });

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
    steps,
    application.submittedSteps,
  );

  const nextStep = getNextNonSubmittedStep(steps, application.submittedSteps);

  // If we cannot find the current page, redirect to the first step
  // that has not been submitted yet, or the last step
  React.useEffect(() => {
    if (empty(currentPage)) {
      navigate(nextStep.mainPage.link.url, {
        replace: true,
      });
    }
  }, [currentPage, navigate, nextStep]);

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
              currentIndex={currentStepIndex}
              steps={steps
                .filter((step) => step.showInStepper)
                .map((step) => {
                  return {
                    href: step.mainPage.link.url,
                    icon: step.mainPage.icon,
                    label: step.mainPage.link.label || step.mainPage.title,
                    completed:
                      step.applicationStep &&
                      application.submittedSteps?.includes(
                        step.applicationStep,
                      ),
                    disabled: !!missingPrerequisites(
                      step.prerequisites,
                      application.submittedSteps,
                    )?.length,
                    error: application.poolAdvertisement
                      ? step.hasError?.(
                          application.user,
                          application.poolAdvertisement,
                          application,
                        )
                      : false,
                  };
                })}
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
  const [{ data, fetching, error, stale }] = useGetApplicationQuery({
    requestPolicy: "cache-first",
    variables: {
      id: applicationId || "",
    },
  });

  const application = data?.poolCandidate;

  return (
    <Pending fetching={fetching || stale} error={error}>
      {application?.poolAdvertisement ? (
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
