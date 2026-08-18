import { useIntl } from "react-intl";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { useMutation } from "urql";

import { toast } from "@gc-digital-talent/toast";
import {
  tryFindMessageDescriptor,
  errorMessages,
} from "@gc-digital-talent/i18n";
import { graphql } from "@gc-digital-talent/graphql";
import { appInsights } from "@gc-digital-talent/app-insights";
import { useAuthentication } from "@gc-digital-talent/auth";

import useRoutes from "~/hooks/useRoutes";

// sessionStorage key holding the poolId a logged-out user wanted to apply to.
// We carry the intent here (rather than in the URL) so it survives the login
// round-trip without colliding with the token params the API appends to `from`.
const APPLY_ON_RETURN_KEY = "applyToPoolOnReturn";

const CreateApplication_Mutation = graphql(/* GraphQL */ `
  mutation CreateApplication($poolId: ID!) {
    createApplication(poolId: $poolId) {
      id
    }
  }
`);

// Shared across every hook instance so the apply triggers rendered on a single
// page (and any auto-resume firing beside them) only create one application.
const inFlightPoolIds = new Set<string>();

interface UseApplyToPoolArgs {
  poolId: string;
  applicationId?: string;
  canApply?: boolean;
}

const useApplyToPool = ({
  poolId,
  applicationId,
  canApply,
}: UseApplyToPoolArgs) => {
  const intl = useIntl();
  const paths = useRoutes();
  const navigate = useNavigate();
  const { loggedIn } = useAuthentication();
  const [{ fetching }, executeMutation] = useMutation(
    CreateApplication_Mutation,
  );

  const trackEvent = (name: string, errorMessage?: string) => {
    appInsights?.trackEvent?.(
      { name },
      {
        aiUserId: appInsights.context?.user?.id || "unknown",
        pageUrl: window.location.href,
        timestamp: new Date().toISOString(),
        referrer: document.referrer || "none",
        source: "ApplicationLink",
        ...(errorMessage ? { errorMessage } : {}),
      },
    );
  };

  const genericErrorMessage = intl.formatMessage({
    defaultMessage: "Error application creation failed",
    id: "tlAiJm",
    description: "Application creation failed",
  });

  const toastError = (message?: string) => {
    trackEvent(
      "Job application creation error",
      message ?? genericErrorMessage,
    );
    if (!message) {
      toast.error(genericErrorMessage);
      return;
    }
    const descriptor = tryFindMessageDescriptor(message);
    toast.error(
      intl.formatMessage(
        descriptor ?? errorMessages.unknownErrorRequestErrorTitle,
      ),
    );
  };

  const goToExistingApplication = async (id: string): Promise<void> => {
    await navigate(paths.application(id), { replace: true });
    toast.info(
      intl.formatMessage({
        defaultMessage: "You already have an application to this pool.",
        id: "fY0W2V",
        description:
          "Notification when a user attempts to apply to a pool when they already have an application there.",
      }),
    );
  };

  const createApplication = async (): Promise<void> => {
    if (inFlightPoolIds.has(poolId)) return;
    inFlightPoolIds.add(poolId);

    try {
      const result = await executeMutation({ poolId });
      const newApplicationId = result.data?.createApplication?.id;

      // The API returns the existing application (with an error recorded) when
      // the user has already applied, so a returned id always means "go there".
      if (!newApplicationId) {
        toastError(result.error?.message);
        return;
      }
      if (result.error) {
        await goToExistingApplication(newApplicationId);
        return;
      }

      trackEvent("Job application started");
      await navigate(paths.application(newApplicationId), { replace: true });
      toast.success(
        intl.formatMessage({
          defaultMessage: "Application created",
          id: "U/ji+A",
          description: "Application created successfully",
        }),
      );
    } catch {
      toastError();
    } finally {
      inFlightPoolIds.delete(poolId);
    }
  };

  // Resolve the apply action: go to the existing application if there is one,
  // otherwise create a new one.
  const apply = async (): Promise<void> => {
    if (applicationId) {
      await goToExistingApplication(applicationId);
    } else if (canApply) {
      await createApplication();
    }
  };

  // Remember the intent before sending a logged-out user to login.
  const rememberIntent = () =>
    sessionStorage.setItem(APPLY_ON_RETURN_KEY, poolId);

  // On returning from login with a matching stored intent, resolve it once.
  const resumed = useRef(false);
  useEffect(() => {
    if (
      !loggedIn ||
      resumed.current ||
      sessionStorage.getItem(APPLY_ON_RETURN_KEY) !== poolId
    ) {
      return;
    }
    resumed.current = true;
    sessionStorage.removeItem(APPLY_ON_RETURN_KEY);
    void apply();
    // NOTE: `apply` is recreated each render, so we key off the primitive values
    // it closes over instead; the `resumed` ref already guards against re-firing.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loggedIn, poolId, applicationId, canApply]);

  return { apply, rememberIntent, applying: fetching };
};

export default useApplyToPool;
