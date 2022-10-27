import React from "react";
import Loading from "@common/components/Pending/Loading";
import { redirect } from "@common/helpers/router";
import { notEmpty } from "@common/helpers/util";
import { useIntl } from "react-intl";
import { toast } from "react-toastify";
import {
  Maybe,
  PoolCandidate,
  Scalars,
  useCreateApplicationMutation,
  useGetPoolAdvertisementQuery,
} from "../../api/generated";
import { useDirectIntakeRoutes } from "../../directIntakeRoutes";
import { hasUserApplied, isAdvertisementVisible } from "./utils";

interface CreateApplicationProps {
  poolId: Scalars["ID"];
}

/**
 * Note: This is not a real page
 * it exists only to create an application
 * and forward a user on
 */
const CreateApplication = ({ poolId }: CreateApplicationProps) => {
  const intl = useIntl();
  const paths = useDirectIntakeRoutes();
  const [{ data }] = useGetPoolAdvertisementQuery({
    variables: { id: poolId },
  });
  const [{ fetching: creating, data: mutationData }, executeMutation] =
    useCreateApplicationMutation();

  // Store path to redirect to later on
  let redirectPath = paths.pool(poolId);

  /**
   * There is a possibility someone navigates
   * directly to this, so check if they should
   * be able to view/apply to it
   */
  const isVisible = isAdvertisementVisible(
    data?.me?.roles?.filter(notEmpty) || [],
    data?.poolAdvertisement?.advertisementStatus ?? null,
  );
  const hasApplied = hasUserApplied(
    (data?.me?.poolCandidates as Maybe<PoolCandidate>[]) || [],
    data?.poolAdvertisement?.id,
  );

  /**
   * Check to see if the application even exists
   */
  const application = data?.me?.poolCandidates?.find((candidate) => {
    return candidate?.pool.id === data?.poolAdvertisement?.id;
  });

  /**
   * Store if the application can be created
   *
   * !creating - Not currently running a mutation
   * !mutationData - The mutation has not previously ran
   * userId - We need a user ID to run the mutation
   * id - We need a pool ID to run the mutation
   * isVisible - Should't run it if user cannot view it
   * !hasApplied - Users can only apply to a single pool advertisement
   */
  const userId = data?.me?.id;
  const canCreate =
    !creating && !mutationData && userId && poolId && isVisible && !hasApplied;

  // Set the redirect path to the application
  // if the user has applied and it exists
  if (hasApplied && application) {
    redirectPath = paths.reviewApplication(application.id);
  }

  /**
   * Handle any errors that occur during mutation
   *
   * @returns null
   */
  const handleError = (msg?: React.ReactNode) => {
    redirect(redirectPath);
    toast.error(
      msg ||
        intl.formatMessage({
          defaultMessage: "Error application creation failed",
          id: "tlAiJm",
          description: "Application creation failed",
        }),
    );
    return null;
  };

  /**
   * Actually run the mutation
   */
  if (canCreate) {
    executeMutation({ userId, poolId })
      .then((result) => {
        if (result.data?.createApplication) {
          // Redirect user to the application on success
          redirect(paths.reviewApplication(result.data.createApplication.id));
          toast.success(
            intl.formatMessage({
              defaultMessage: "Application created",
              id: "U/ji+A",
              description: "Application created successfully",
            }),
          );
          return null;
        }
        return handleError();
      })
      .catch(handleError);
  }

  // If a user has already applied or this pool is a draft
  // redirect them away from this route with a toast
  if ((hasApplied || !isVisible) && !creating) {
    handleError(
      hasApplied
        ? intl.formatMessage({
            defaultMessage: "You have already applied to this.",
            id: "mwEGU+",
            description:
              "Disabled button when a user already applied to a pool opportunity",
          })
        : undefined,
    );
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
