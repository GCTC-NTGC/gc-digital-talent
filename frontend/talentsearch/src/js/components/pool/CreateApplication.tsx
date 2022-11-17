import React from "react";
import Loading from "@common/components/Pending/Loading";
import { redirect } from "@common/helpers/router";
import { useIntl } from "react-intl";
import { Id, toast } from "react-toastify";
import { notEmpty } from "@common/helpers/util";
import { tryFindMessageDescriptor } from "@common/messages/apiMessages";
import { AuthorizationContext } from "@common/components/Auth";
import { Scalars, useCreateApplicationMutation } from "../../api/generated";
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
  const errorToastId = React.useRef<Id>("");
  const paths = useDirectIntakeRoutes();
  const auth = React.useContext(AuthorizationContext);
  const [
    { fetching: creating, data: mutationData, operation },
    executeMutation,
  ] = useCreateApplicationMutation();

  // Store path to redirect to later on
  let redirectPath = paths.pool(poolId);

  /**
   * Handle any errors that occur during mutation
   *
   * @returns null
   */
  const handleError = React.useCallback(
    (msg?: React.ReactNode, path?: string) => {
      redirect(path || redirectPath);
      /**
       * This is supposed to prevent the toast
       * from firing twice, but it does not appear to
       * work. Leaving it in, in the hopes
       * it finally does 🤷‍♀️
       */
      if (!toast.isActive(errorToastId.current)) {
        errorToastId.current = toast.error(
          msg ||
            intl.formatMessage({
              defaultMessage: "Error application creation failed",
              id: "tlAiJm",
              description: "Application creation failed",
            }),
        );
      }
      return null;
    },
    [intl, redirectPath],
  );

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
  const userId = auth.loggedInUser?.id;
  const hasMutationData = notEmpty(mutationData);
  const isCreating = creating || hasMutationData || operation?.key;
  const hasRequiredData = userId && poolId;

  if (!hasRequiredData) {
    if (!poolId) {
      redirectPath = paths.allPools();
    }
    handleError();
  }

  const createApplication = React.useCallback(() => {
    if (!isCreating && userId && poolId) {
      executeMutation({ userId, poolId })
        .then((result) => {
          if (result.data?.createApplication) {
            const newPath = paths.reviewApplication(
              result.data.createApplication.id,
            );
            // Redirect user to the application if it exists
            // Toast success or error
            if (!result.error) {
              redirect(newPath);
              toast.success(
                intl.formatMessage({
                  defaultMessage: "Application created",
                  id: "U/ji+A",
                  description: "Application created successfully",
                }),
              );
            } else {
              const message = tryFindMessageDescriptor(result.error.message);
              handleError(message, newPath);
            }
          } else if (result.error?.message) {
            handleError(tryFindMessageDescriptor(result.error.message));
          } else {
            // Fallback to generic message
            handleError();
          }
        })
        .catch(handleError);
    }
  }, [isCreating, userId, poolId, executeMutation, handleError, paths, intl]);

  React.useEffect(() => {
    createApplication();
  }, [createApplication]);

  // Don't render the page if the mutation ran already
  if (hasMutationData) {
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
