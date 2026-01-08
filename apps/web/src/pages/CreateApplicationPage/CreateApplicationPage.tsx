import { useRef } from "react";
import { useIntl } from "react-intl";
import { useNavigate } from "react-router";
import { useMutation, useQuery } from "urql";

import { Loading } from "@gc-digital-talent/ui";
import { toast } from "@gc-digital-talent/toast";
import { notEmpty } from "@gc-digital-talent/helpers";
import {
  tryFindMessageDescriptor,
  errorMessages,
} from "@gc-digital-talent/i18n";
import { ROLE_NAME, useAuthorization } from "@gc-digital-talent/auth";
import { graphql, Scalars } from "@gc-digital-talent/graphql";
import { appInsights } from "@gc-digital-talent/app-insights";

import useRoutes from "~/hooks/useRoutes";
import useRequiredParams from "~/hooks/useRequiredParams";
import RequireAuth from "~/components/RequireAuth/RequireAuth";

interface RouteParams extends Record<string, string> {
  poolId: Scalars["ID"]["output"];
}

const CreateApplicationApplications_Query = graphql(/* GraphQL */ `
  query CreateApplicationApplications {
    me {
      id
      poolCandidates {
        id
        status {
          value
        }
        archivedAt
        submittedAt
        pool {
          id
        }
      }
    }
  }
`);

const CreateApplication_Mutation = graphql(/* GraphQL */ `
  mutation CreateApplication($userId: ID!, $poolId: ID!) {
    createApplication(userId: $userId, poolId: $poolId) {
      id
    }
  }
`);

/**
 * Note: This is not a real page
 * it exists only to create an application
 * and forward a user on
 */
const CreateApplication = () => {
  const { poolId } = useRequiredParams<RouteParams>("poolId");
  const intl = useIntl();
  const paths = useRoutes();
  const navigate = useNavigate();
  const auth = useAuthorization();
  const [{ data: newApplicationData }, executeMutation] = useMutation(
    CreateApplication_Mutation,
  );
  const [{ data: existingApplicationsData }] = useQuery({
    query: CreateApplicationApplications_Query,
  });

  // Store path to redirect to later on
  let redirectPath = paths.jobPoster(poolId);

  const genericErrorMessage = intl.formatMessage({
    defaultMessage: "Error application creation failed",
    id: "tlAiJm",
    description: "Application creation failed",
  });

  function trackError(msg: string) {
    if (appInsights) {
      const aiUserId = appInsights?.context?.user?.id || "unknown";
      appInsights.trackEvent?.(
        { name: "Job application creation error" },
        {
          aiUserId,
          pageUrl: window.location.href,
          timestamp: new Date().toISOString(),
          referrer: document.referrer || "none",
          source: "CreateApplicationPage",
          errorMessage: msg,
        },
      );
    }
  }

  // We use this ref to make sure we only try to apply once
  const mutationCounter = useRef<number>(0);
  // We use this ref to make sure we only start navigation and pop a toast once
  const navigateWithToastCounter = useRef<number>(0);

  // Start navigation and pop a toast.  Increment the ref to ensure we only do this once.
  const navigateWithToast = async (
    path: string,
    toastFunction: () => void,
  ): Promise<void> => {
    navigateWithToastCounter.current += 1;
    if (navigateWithToastCounter.current > 1) return; // we've already started navigation
    await navigate(path, { replace: true });
    toastFunction();
  };

  // If a "me" object came back then we've checked.
  const checkedForExistingApplications = notEmpty(existingApplicationsData?.me);
  // Build an array of existing applications.
  const existingApplications =
    existingApplicationsData?.me?.poolCandidates?.map((application) => {
      return {
        applicationId: application?.id,
        poolId: application?.pool.id,
      };
    });
  // Find the pool candidate ID if we've already applied to this pool.
  const existingApplicationIdToThisPool = existingApplications?.find(
    (a) => a.poolId === poolId,
  )?.applicationId;
  // An existing application was found for this pool.  No need to create a new one - let's go.
  if (existingApplicationIdToThisPool) {
    void navigateWithToast(
      paths.application(existingApplicationIdToThisPool),
      () =>
        toast.info(
          intl.formatMessage({
            defaultMessage: "You already have an application to this pool.",
            id: "fY0W2V",
            description:
              "Notification when a user attempts to apply to a pool when they already have an application there.",
          }),
        ),
    );
  }

  /**
   * Store if the application can be created
   *
   * userId - We need a user ID to run the mutation
   * hasNewApplicationData - We've created the new application and have the results
   * haveRequiredDataToCreateNewApplication - We need some data to create the new application
   * mutationCounter.current - Keep track of how many times we've applied - we should only do it once
   * checkedForExistingApplications - We should check existing applications before applying again
   * existingApplicationIdToThisPool - If there's already an application to this pool don't apply again
   */
  const userId = auth.userAuthInfo?.id;
  const hasNewApplicationData = notEmpty(newApplicationData);
  const haveRequiredDataToCreateNewApplication = userId && poolId;

  if (!haveRequiredDataToCreateNewApplication) {
    if (!poolId) {
      redirectPath = paths.jobs();
    }
    void navigateWithToast(redirectPath, () =>
      toast.error(genericErrorMessage),
    );
  }

  if (
    mutationCounter.current === 0 &&
    haveRequiredDataToCreateNewApplication &&
    checkedForExistingApplications &&
    !existingApplicationIdToThisPool
  ) {
    mutationCounter.current += 1;
    executeMutation({ userId, poolId })
      .then(async (result) => {
        if (result.data?.createApplication) {
          const { id } = result.data.createApplication;
          const newPath = paths.application(id);
          // Redirect user to the application if it exists
          // Toast success or error
          if (!result.error) {
            // Log the creation of the application with app insights
            if (appInsights) {
              const aiUserId = appInsights?.context?.user?.id || "unknown";
              appInsights.trackEvent?.(
                { name: "Job application started" },
                {
                  aiUserId,
                  pageUrl: window.location.href,
                  timestamp: new Date().toISOString(),
                  referrer: document.referrer || "none",
                  source: "CreateApplicationPage",
                },
              );
            }

            await navigateWithToast(newPath, () =>
              toast.success(
                intl.formatMessage({
                  defaultMessage: "Application created",
                  id: "U/ji+A",
                  description: "Application created successfully",
                }),
              ),
            );
          } else {
            const messageDescriptor = tryFindMessageDescriptor(
              result.error.message,
            );
            const message = intl.formatMessage(
              messageDescriptor ?? errorMessages.unknownErrorRequestErrorTitle,
            );
            trackError(result.error.message);
            await navigateWithToast(newPath, () => toast.error(message));
          }
        } else if (result.error?.message) {
          const messageDescriptor = tryFindMessageDescriptor(
            result.error.message,
          );
          const errorMessage = intl.formatMessage(
            messageDescriptor ?? errorMessages.unknownErrorRequestErrorTitle,
          );
          trackError(result.error.message);
          await navigateWithToast(redirectPath, () =>
            toast.error(errorMessage),
          );
        } else {
          trackError(genericErrorMessage);
          // Fallback to generic message
          await navigateWithToast(redirectPath, () =>
            toast.error(genericErrorMessage),
          );
        }
      })
      .catch(() =>
        navigateWithToast(redirectPath, () => toast.error(genericErrorMessage)),
      );
  }

  // Don't render the page if the mutation ran already
  if (hasNewApplicationData) {
    return null;
  }

  /**
   * Render the loading spinner while we do
   * the necessary work
   *
   * Note: This component should always redirect to a path
   * based on the logic, so no need to render anything but
   * a loading spinner
   */
  return <Loading />;
};

export const Component = () => (
  <RequireAuth roles={[ROLE_NAME.Applicant]}>
    <CreateApplication />
  </RequireAuth>
);

Component.displayName = "CreateApplicationPage";

export default Component;
