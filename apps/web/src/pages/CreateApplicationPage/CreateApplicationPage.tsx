import React from "react";
import { useIntl } from "react-intl";
import { useNavigate, useParams } from "react-router-dom";

import { Loading } from "@gc-digital-talent/ui";
import { toast } from "@gc-digital-talent/toast";
import { notEmpty } from "@gc-digital-talent/helpers";
import { useFeatureFlags } from "@gc-digital-talent/env";
import {
  tryFindMessageDescriptor,
  errorMessages,
} from "@gc-digital-talent/i18n";
import { useAuthorization } from "@gc-digital-talent/auth";

import useRoutes from "~/hooks/useRoutes";
import {
  Scalars,
  useCreateApplicationMutation,
  useMyApplicationsQuery,
} from "~/api/generated";

type RouteParams = {
  poolId: Scalars["ID"];
};

/**
 * Note: This is not a real page
 * it exists only to create an application
 * and forward a user on
 */
const CreateApplication = () => {
  const { poolId } = useParams<RouteParams>();
  const intl = useIntl();
  const paths = useRoutes();
  const navigate = useNavigate();
  const { applicationRevamp } = useFeatureFlags();
  const auth = useAuthorization();
  const [{ data: newApplicationData }, executeMutation] =
    useCreateApplicationMutation();
  const [{ data: existingApplicationsData }] = useMyApplicationsQuery();

  // Path to display application (new or existing).
  const applicationPath = React.useCallback(
    (applicationId: string) =>
      applicationRevamp
        ? paths.application(applicationId)
        : paths.reviewApplication(applicationId),
    [applicationRevamp, paths],
  );

  // Store path to redirect to later on
  let redirectPath = paths.pool(poolId || "");

  // We hae the mutation in a useCallback to run once only but it fires twice in strict mode.
  const mutationCounter = React.useRef<number>(0);

  /**
   * Handle any errors that occur during mutation
   *
   * @returns null
   */
  const handleError = React.useCallback(
    (msg?: React.ReactNode, path?: string) => {
      navigate(path || redirectPath, { replace: true });
      toast.error(
        msg ||
          intl.formatMessage({
            defaultMessage: "Error application creation failed",
            id: "tlAiJm",
            description: "Application creation failed",
          }),
      );
      return null;
    },
    [intl, redirectPath, navigate],
  );

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
    navigate(applicationPath(existingApplicationIdToThisPool), {
      replace: true,
    });
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
  const userId = auth.user?.id;
  const hasNewApplicationData = notEmpty(newApplicationData);
  const haveRequiredDataToCreateNewApplication = userId && poolId;

  if (!haveRequiredDataToCreateNewApplication) {
    if (!poolId) {
      redirectPath = paths.browsePools();
    }
    handleError();
  }

  const createApplication = React.useCallback(() => {
    if (
      mutationCounter.current === 0 &&
      haveRequiredDataToCreateNewApplication &&
      checkedForExistingApplications &&
      !existingApplicationIdToThisPool
    ) {
      mutationCounter.current += 1;
      executeMutation({ userId, poolId })
        .then((result) => {
          if (result.data?.createApplication) {
            const { id } = result.data.createApplication;
            const newPath = applicationPath(id);
            // Redirect user to the application if it exists
            // Toast success or error
            if (!result.error) {
              navigate(newPath, { replace: true });
              toast.success(
                intl.formatMessage({
                  defaultMessage: "Application created",
                  id: "U/ji+A",
                  description: "Application created successfully",
                }),
              );
            } else {
              const messageDescriptor = tryFindMessageDescriptor(
                result.error.message,
              );
              const message = intl.formatMessage(
                messageDescriptor ??
                  errorMessages.unknownErrorRequestErrorTitle,
              );
              handleError(message, newPath);
            }
          } else if (result.error?.message) {
            const messageDescriptor = tryFindMessageDescriptor(
              result.error.message,
            );
            const message = intl.formatMessage(
              messageDescriptor ?? errorMessages.unknownErrorRequestErrorTitle,
            );
            handleError(message);
          } else {
            // Fallback to generic message
            handleError();
          }
        })
        .catch(handleError);
    }
  }, [
    haveRequiredDataToCreateNewApplication,
    checkedForExistingApplications,
    existingApplicationIdToThisPool,
    executeMutation,
    userId,
    poolId,
    handleError,
    applicationPath,
    navigate,
    intl,
  ]);

  React.useEffect(() => {
    createApplication();
  }, [createApplication]);

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

export default CreateApplication;
