import { useIntl, defineMessage } from "react-intl";
import { Outlet, useNavigate, useParams } from "react-router";
import type { OperationContext } from "urql";
import { useQuery } from "urql";
import { useEffect } from "react";

import {
  TableOfContents,
  Stepper,
  Loading,
  Container,
} from "@gc-digital-talent/ui";
import {
  empty,
  isUuidError,
  notEmpty,
  NotFoundError,
} from "@gc-digital-talent/helpers";
import { navigationMessages } from "@gc-digital-talent/i18n";
import type { FragmentType } from "@gc-digital-talent/graphql";
import {
  ApplicationStatus,
  getFragment,
  graphql,
} from "@gc-digital-talent/graphql";
import { ROLE_NAME } from "@gc-digital-talent/auth";
import { getFromLocalStorage } from "@gc-digital-talent/storage";

import SEO from "~/components/SEO/SEO";
import Hero from "~/components/Hero";
import useRoutes from "~/hooks/useRoutes";
import useCurrentPage from "~/hooks/useCurrentPage";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import { poolTitle } from "~/utils/poolUtils";
import {
  applicationStepsToStepperArgs,
  getNextStepToSubmit,
  isOnDisabledPage,
} from "~/utils/applicationUtils";
import RequireAuth from "~/components/RequireAuth/RequireAuth";
import { KEY_NEW_USER_LANGUAGE_PRESET } from "~/constants/storageKeys";

import StepDisabledPage from "./StepDisabledPage/StepDisabledPage";
import ApplicationContextProvider from "./ApplicationContext";
import useApplicationId from "./useApplicationId";
import type { ContextType } from "./useApplication";
import Application_PoolCandidateFragment from "./fragment";
import { getApplicationSteps } from "./utils";

interface RouteParams extends Record<string, string> {
  experienceId: string;
}

interface ApplicationPageWrapperProps {
  query: FragmentType<typeof Application_PoolCandidateFragment>;
}

const ApplicationPageWrapper = ({ query }: ApplicationPageWrapperProps) => {
  const intl = useIntl();
  const paths = useRoutes();
  const navigate = useNavigate();
  const { experienceId } = useParams<RouteParams>();
  const application = getFragment(Application_PoolCandidateFragment, query);
  const steps = getApplicationSteps({
    intl,
    paths,
    application,
    experienceId,
  });
  const browserState = {
    languagePresetNoticeIsVisible: getFromLocalStorage<boolean>(
      KEY_NEW_USER_LANGUAGE_PRESET,
      false,
    ),
  };
  const title = poolTitle(intl, application.pool);

  const pageTitle = defineMessage({
    defaultMessage: "Apply to {poolName}",
    id: "K8CPir",
    description: "Heading for the application page",
  });

  const pages = steps
    .flatMap((step) => [
      step.mainPage,
      step.introductionPage,
      ...(step.auxiliaryPages ?? []),
    ])
    .filter(notEmpty);

  const currentPage = useCurrentPage(pages);
  const currentCrumbs = currentPage?.crumbs ?? [];

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

  const crumbs = useBreadcrumbs({
    crumbs: [
      {
        url: paths.jobs(),
        label: intl.formatMessage(navigationMessages.browseJobs),
      },
      {
        url: paths.jobPoster(application.pool.id),
        label: title.html,
      },
      ...currentCrumbs,
    ],
  });

  const userIsOnDisabledPage = isOnDisabledPage(
    currentPage?.link.url,
    steps,
    application.submittedSteps,
  );

  const isSubmitted =
    !!application.submittedAt ||
    application.status?.value !== ApplicationStatus.Draft;

  // If we cannot find the current page, redirect to the first step
  // that has not been submitted yet, or the last step
  useEffect(() => {
    if (empty(currentPage)) {
      void navigate(nextStepToSubmit.mainPage.link.url, {
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
      <SEO
        title={intl.formatMessage(pageTitle, { poolName: title.label })}
        description={currentPage?.subtitle}
      />
      <Hero
        title={intl.formatMessage(pageTitle, { poolName: title.html })}
        crumbs={crumbs}
        subtitle={currentPage?.subtitle}
      />
      <Container className="mt-18">
        <TableOfContents.Wrapper>
          <TableOfContents.Sidebar>
            <Stepper
              label={intl.formatMessage({
                defaultMessage: "Application steps",
                id: "y2Rl/m",
                description: "Label for the application stepper navigation",
              })}
              currentIndex={currentStepIndex}
              readOnly={isSubmitted}
              steps={applicationStepsToStepperArgs(
                steps,
                application,
                browserState,
              )}
            />
          </TableOfContents.Sidebar>
          <TableOfContents.Content>
            {userIsOnDisabledPage ? (
              <StepDisabledPage
                returnUrl={nextStepToSubmit.mainPage.link.url}
              />
            ) : (
              <Outlet context={{ application } satisfies ContextType} />
            )}
          </TableOfContents.Content>
        </TableOfContents.Wrapper>
      </Container>
    </ApplicationContextProvider>
  );
};

const context: Partial<OperationContext> = {
  additionalTypenames: [
    "AwardExperience",
    "CommunityExperience",
    "EducationExperience",
    "PersonalExperience",
    "WorkExperience",
  ], // This lets urql know when to invalidate cache if request returns empty list. https://formidable.com/open-source/urql/docs/basics/document-caching/#document-cache-gotchas
  requestPolicy: "cache-first",
};

const Application_Query = graphql(/* GraphQL */ `
  query Application($id: UUID!) {
    poolCandidate(id: $id) {
      ...Application_PoolCandidate
    }
  }
`);

const Layout = () => {
  const id = useApplicationId();
  const [{ data, fetching, error, stale }] = useQuery({
    query: Application_Query,
    context,
    variables: {
      id,
    },
  });

  if (error) {
    if (isUuidError(error)) {
      throw new NotFoundError();
    }
  }

  return (
    <>
      {fetching || stale ? (
        <Loading live="polite" className="bg-white dark:bg-gray-700" />
      ) : null}
      {data?.poolCandidate ? (
        <ApplicationPageWrapper query={data.poolCandidate} />
      ) : null}
    </>
  );
};

export const Component = () => (
  <RequireAuth roles={[ROLE_NAME.Applicant]}>
    <Layout />
  </RequireAuth>
);

Component.displayName = "ApplicationLayout";

export default Component;
