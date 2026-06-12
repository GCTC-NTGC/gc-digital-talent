import { useIntl } from "react-intl";
import { useNavigate } from "react-router";
import { useMutation } from "urql";

import { toast } from "@gc-digital-talent/toast";
import {
  tryFindMessageDescriptor,
  errorMessages,
} from "@gc-digital-talent/i18n";
import { graphql } from "@gc-digital-talent/graphql";
import { appInsights } from "@gc-digital-talent/app-insights";

import useRoutes from "~/hooks/useRoutes";

// sessionStorage key holding the poolId a logged-out user wanted to apply to.
// We carry the intent here (rather than in the URL) so it survives the login
// round-trip without colliding with the token params the API appends to `from`.
export const APPLY_ON_RETURN_KEY = "applyToPoolOnReturn";

const CreateApplication_Mutation = graphql(/* GraphQL */ `
  mutation CreateApplication($poolId: ID!) {
    createApplication(poolId: $poolId) {
      id
    }
  }
`);

// Shared across every hook instance so the multiple apply triggers rendered on a
// single page (or an auto-submit firing alongside them) only create one application.
const inFlightPoolIds = new Set<string>();

const useApplyToPool = () => {
  const intl = useIntl();
  const paths = useRoutes();
  const navigate = useNavigate();
  const [{ fetching }, executeMutation] = useMutation(
    CreateApplication_Mutation,
  );

  const genericErrorMessage = intl.formatMessage({
    defaultMessage: "Error application creation failed",
    id: "tlAiJm",
    description: "Application creation failed",
  });

  const trackError = (msg: string) => {
    if (appInsights) {
      const aiUserId = appInsights?.context?.user?.id || "unknown";
      appInsights.trackEvent?.(
        { name: "Job application creation error" },
        {
          aiUserId,
          pageUrl: window.location.href,
          timestamp: new Date().toISOString(),
          referrer: document.referrer || "none",
          source: "ApplicationLink",
          errorMessage: msg,
        },
      );
    }
  };

  const applyToPool = async (poolId: string): Promise<void> => {
    if (inFlightPoolIds.has(poolId)) return;
    inFlightPoolIds.add(poolId);

    try {
      const result = await executeMutation({ poolId });
      const newApplicationId = result.data?.createApplication?.id;

      if (newApplicationId && !result.error) {
        if (appInsights) {
          const aiUserId = appInsights?.context?.user?.id || "unknown";
          appInsights.trackEvent?.(
            { name: "Job application started" },
            {
              aiUserId,
              pageUrl: window.location.href,
              timestamp: new Date().toISOString(),
              referrer: document.referrer || "none",
              source: "ApplicationLink",
            },
          );
        }

        await navigate(paths.application(newApplicationId), { replace: true });
        toast.success(
          intl.formatMessage({
            defaultMessage: "Application created",
            id: "U/ji+A",
            description: "Application created successfully",
          }),
        );
        return;
      }

      if (result.error?.message) {
        const messageDescriptor = tryFindMessageDescriptor(
          result.error.message,
        );
        const message = intl.formatMessage(
          messageDescriptor ?? errorMessages.unknownErrorRequestErrorTitle,
        );
        trackError(result.error.message);
        toast.error(message);
        return;
      }

      trackError(genericErrorMessage);
      toast.error(genericErrorMessage);
    } catch {
      trackError(genericErrorMessage);
      toast.error(genericErrorMessage);
    } finally {
      inFlightPoolIds.delete(poolId);
    }
  };

  return { applyToPool, applying: fetching };
};

export default useApplyToPool;
