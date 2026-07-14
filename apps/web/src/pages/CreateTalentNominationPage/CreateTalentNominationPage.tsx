/* eslint-disable react-hooks/refs */
import { useRef } from "react";
import { useIntl } from "react-intl";
import { useNavigate } from "react-router";
import { useMutation, useQuery } from "urql";

import { Loading, NotFound, Pending } from "@gc-digital-talent/ui";
import { toast } from "@gc-digital-talent/toast";
import {
  tryFindMessageDescriptor,
  errorMessages,
  commonMessages,
} from "@gc-digital-talent/i18n";
import { ROLE_NAME } from "@gc-digital-talent/auth";
import type { CreateTalentNominationInput } from "@gc-digital-talent/graphql";
import { graphql } from "@gc-digital-talent/graphql";
import { isPastDateTime } from "@gc-digital-talent/date-helpers";

import useRoutes from "~/hooks/useRoutes";
import useRequiredParams from "~/hooks/useRequiredParams";
import RequireAuth from "~/components/RequireAuth/RequireAuth";
import { getProtectedOperationContext } from "~/utils/protectedUrqlContext";

const CreateTalentNomination_Mutation = graphql(/* GraphQL */ `
  mutation CreateTalentNomination(
    $talentNomination: CreateTalentNominationInput!
  ) {
    createTalentNomination(talentNomination: $talentNomination) {
      id
    }
  }
`);

interface CreateTalentNominationProps {
  nominationEventId: string;
  nominationEventCloseDate: string;
}

/**
 * Note: This is not a real page
 * it exists only to create a talent nomination
 * and forward a user on
 */
const CreateTalentNomination = ({
  nominationEventId,
  nominationEventCloseDate,
}: CreateTalentNominationProps) => {
  const intl = useIntl();
  const paths = useRoutes();
  const navigate = useNavigate();
  const [_, executeCreateMutation] = useMutation(
    CreateTalentNomination_Mutation,
  );

  // Store path to redirect to later on
  const errorRedirectPath = paths.talentManagementEvents();

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

  const eventAlreadyClosed = isPastDateTime(nominationEventCloseDate);

  // if the event already closed than we need to use the protected endpoint to use elevated permissions
  const queryContext = eventAlreadyClosed
    ? getProtectedOperationContext()
    : undefined;

  if (mutationCounter.current === 0) {
    mutationCounter.current += 1;

    const mutationInput: CreateTalentNominationInput = {
      talentNominationEvent: {
        connect: nominationEventId,
      },
    };

    executeCreateMutation({ talentNomination: mutationInput }, queryContext)
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
          await navigateWithToast(errorRedirectPath, () =>
            toast.error(errorMessage),
          );
        } else {
          // Fallback to generic message
          await navigateWithToast(errorRedirectPath, () =>
            toast.error(genericErrorMessage),
          );
        }
      })
      .catch(() => {
        return navigateWithToast(errorRedirectPath, () =>
          toast.error(genericErrorMessage),
        );
      });
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

const CreateTalentNomination_Query = graphql(/* GraphQL */ `
  query CreateTalentNominationQuery($nominationEventId: UUID!) {
    talentNominationEvent(id: $nominationEventId) {
      id
      closeDate
    }
  }
`);

interface RouteParams extends Record<string, string> {
  nominationEventId: string;
}

const CreateTalentNominationApi = () => {
  const intl = useIntl();
  const { nominationEventId } =
    useRequiredParams<RouteParams>("nominationEventId");

  const [{ data, fetching, error }] = useQuery({
    query: CreateTalentNomination_Query,
    variables: { nominationEventId },
  });

  return (
    <Pending fetching={fetching} error={error}>
      {data?.talentNominationEvent ? (
        <CreateTalentNomination
          nominationEventId={data?.talentNominationEvent?.id}
          nominationEventCloseDate={data?.talentNominationEvent?.closeDate}
        />
      ) : (
        <NotFound headingMessage={intl.formatMessage(commonMessages.notFound)}>
          <p>
            {intl.formatMessage(
              {
                defaultMessage: "Talent nomination event {eventId} not found.",
                id: "hNIQyO",
                description:
                  "Message displayed for talent nomination event not found.",
              },
              { eventId: nominationEventId },
            )}
          </p>
        </NotFound>
      )}
    </Pending>
  );
};

export const Component = () => (
  <RequireAuth roles={[ROLE_NAME.Applicant]}>
    <CreateTalentNominationApi />
  </RequireAuth>
);

Component.displayName = "CreateTalentNominationPage";

export default Component;
