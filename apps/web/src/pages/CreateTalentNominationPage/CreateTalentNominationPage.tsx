import { useRef } from "react";
import { useIntl } from "react-intl";
import { useNavigate } from "react-router";
import { useMutation } from "urql";

import { Loading } from "@gc-digital-talent/ui";
import { toast } from "@gc-digital-talent/toast";
import {
  tryFindMessageDescriptor,
  errorMessages,
} from "@gc-digital-talent/i18n";
import { ROLE_NAME } from "@gc-digital-talent/auth";
import {
  CreateTalentNominationInput,
  graphql,
  Scalars,
} from "@gc-digital-talent/graphql";

import useRoutes from "~/hooks/useRoutes";
import useRequiredParams from "~/hooks/useRequiredParams";
import RequireAuth from "~/components/RequireAuth/RequireAuth";

interface RouteParams extends Record<string, string> {
  id: Scalars["ID"]["output"];
}

const CreateTalentNomination_Mutation = graphql(/* GraphQL */ `
  mutation CreateTalentNomination(
    $talentNomination: CreateTalentNominationInput!
  ) {
    createTalentNomination(talentNomination: $talentNomination) {
      id
    }
  }
`);

/**
 * Note: This is not a real page
 * it exists only to create a talent nomination
 * and forward a user on
 */
const CreateTalentNominationPage = () => {
  const { nominationEventId } =
    useRequiredParams<RouteParams>("nominationEventId");
  const intl = useIntl();
  const paths = useRoutes();
  const navigate = useNavigate();
  const [_, executeCreateMutation] = useMutation(
    CreateTalentNomination_Mutation,
  );

  // Store path to redirect to later on
  let redirectPath = paths.talentManagementEvents();

  const genericErrorMessage = intl.formatMessage({
    defaultMessage: "Failed to create nomination",
    id: "VMcxoH",
    description: "Toast for error during nomination creation",
  });

  // We use this ref to make sure we only try to apply once
  const mutationCounter = useRef<number>(0);
  // We use this ref to make sure we only start navigation and pop a toast once
  const navigateWithToastCounter = useRef<number>(0);

  // Start navigation and pop a toast. Increment the ref to ensure we only do this once.
  const navigateWithToast = async (
    path: string,
    toastFunction: () => void,
  ): Promise<void> => {
    navigateWithToastCounter.current += 1;
    if (navigateWithToastCounter.current > 1) return; // we've already started navigation
    await navigate(path, { replace: true });
    toastFunction();
  };

  /**
   * Store if the talent nomination can be created
   *
   * haveRequiredDataToCreateNewTalentNomination - We need some data to create the new talent nomination
   * mutationCounter.current - Keep track of how many times we've applied - we should only do it once
   */
  const haveRequiredDataToCreateNewTalentNomination = nominationEventId;

  if (!haveRequiredDataToCreateNewTalentNomination) {
    if (!nominationEventId) {
      redirectPath = paths.talentManagementEvents();
    }
    void navigateWithToast(redirectPath, () =>
      toast.error(genericErrorMessage),
    );
  }

  if (
    mutationCounter.current === 0 &&
    haveRequiredDataToCreateNewTalentNomination
  ) {
    mutationCounter.current += 1;

    const mutationInput: CreateTalentNominationInput = {
      talentNominationEvent: {
        connect: nominationEventId,
      },
    };
    executeCreateMutation({ talentNomination: mutationInput })
      .then(async (result) => {
        if (result.data?.createTalentNomination) {
          const { id } = result.data.createTalentNomination;
          // Redirect user to the talent nomination if it exists
          const newPath = paths.talentNomination(id);
          if (!result.error) {
            await navigateWithToast(newPath, () =>
              toast.success(
                intl.formatMessage({
                  defaultMessage: "Nomination created successfully",
                  id: "qWew0O",
                  description: "Toast for successful nomination creation",
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
            await navigateWithToast(newPath, () => toast.error(message));
          }
        } else if (result.error?.message) {
          const messageDescriptor = tryFindMessageDescriptor(
            result.error.message,
          );
          const errorMessage = intl.formatMessage(
            messageDescriptor ?? errorMessages.unknownErrorRequestErrorTitle,
          );
          await navigateWithToast(redirectPath, () =>
            toast.error(errorMessage),
          );
        } else {
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
    <CreateTalentNominationPage />
  </RequireAuth>
);

Component.displayName = "CreateTalentNominationPage";

export default Component;
