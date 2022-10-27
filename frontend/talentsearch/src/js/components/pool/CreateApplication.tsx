import React from "react";
import Loading from "@common/components/Pending/Loading";
import { redirect } from "@common/helpers/router";
import { useIntl } from "react-intl";
import { toast } from "react-toastify";
import {
  Scalars,
  useCreateApplicationMutation,
  useGetPoolAdvertisementQuery,
} from "../../api/generated";
import { useDirectIntakeRoutes } from "../../directIntakeRoutes";

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
  const isCreating = !creating && !mutationData;
  const hasRequiredData = userId && poolId;

  if (!hasRequiredData) {
    if (!poolId) {
      redirectPath = paths.allPools();
    }
    handleError();
  }

  /**
   * Actually run the mutation
   */
  if (!isCreating && hasRequiredData) {
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
        }
        if (result.error) {
          handleError(result.error);
        }

        // Finally, handle any other issue
        handleError();
      })
      .catch(handleError);
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
