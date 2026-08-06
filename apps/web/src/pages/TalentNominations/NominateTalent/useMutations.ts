import { useMutation } from "urql";
import { defineMessage, useIntl } from "react-intl";
import { useNavigate, useSearchParams } from "react-router";

import type { UpdateTalentNominationInput } from "@gc-digital-talent/graphql";
import { graphql } from "@gc-digital-talent/graphql";
import { toast } from "@gc-digital-talent/toast";
import {
  errorMessages,
  tryFindMessageDescriptor,
} from "@gc-digital-talent/i18n";

import useRequiredParams from "~/hooks/useRequiredParams";
import useRoutes from "~/hooks/useRoutes";
import { getProtectedOperationContext } from "~/utils/protectedUrqlContext";

import type { RouteParams, SubmitIntent } from "./types";
import useCurrentStep from "./useCurrentStep";

const NominateTalentUpdate_Mutation = graphql(/* GraphQL */ `
  mutation NominateTalentUpdate(
    $talentNomination: UpdateTalentNominationInput!
  ) {
    updateTalentNomination(talentNomination: $talentNomination) {
      id
    }
  }
`);

const NominateTalentSubmit_Mutation = graphql(/* GraphQL */ `
  mutation NominateTalentSubmit($id: UUID!) {
    submitTalentNomination(id: $id) {
      id
    }
  }
`);

interface TalentNominationMutations {
  update: (
    talentNomination: UpdateTalentNominationInput,
    intent: SubmitIntent,
  ) => Promise<void>;
  submit: (intent: SubmitIntent) => Promise<void> | null;
}

type UseMutationsReturn = [boolean, TalentNominationMutations];

interface UseMutationsOptions {
  forceProtectedEndpoint: boolean;
}

const useMutations = (options: UseMutationsOptions): UseMutationsReturn => {
  const intl = useIntl();
  const { id } = useRequiredParams<RouteParams>("id");
  const paths = useRoutes();
  const [, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { next } = useCurrentStep();
  const [{ fetching: updating }, executeUpdateMutation] = useMutation(
    NominateTalentUpdate_Mutation,
  );
  const [{ fetching: submitting }, executeSubmitMutation] = useMutation(
    NominateTalentSubmit_Mutation,
  );
  const queryContext = options.forceProtectedEndpoint
    ? getProtectedOperationContext()
    : undefined;

  const update: TalentNominationMutations["update"] = async (
    talentNomination,
    intent,
  ) => {
    return executeUpdateMutation({ talentNomination }, queryContext)
      .then(async (res) => {
        if (res.error?.message) {
          throw new Error(res.error.message);
        }

        if (res.data?.updateTalentNomination) {
          if (next && intent === "next-step") {
            setSearchParams((params) => {
              params.set("step", next);
              return params;
            });
          }

          if (intent === "save-draft") {
            await navigate(paths.applicantDashboard());
          }

          return;
        }

        throw new Error(intl.formatMessage(errorMessages.error));
      })
      .catch((error: Error) => {
        const messageDescriptor =
          tryFindMessageDescriptor(error.message) ??
          defineMessage({
            defaultMessage: "Error updating talent nomination",
            id: "UlK+Qm",
            description:
              "Error message displayed when a talent nomination could not be updated",
          });
        toast.error(intl.formatMessage(messageDescriptor));
      });
  };

  const submit: TalentNominationMutations["submit"] = async (intent) => {
    if (intent === "save-draft") {
      return await navigate(paths.applicantDashboard());
    }

    return executeSubmitMutation({ id }, queryContext)
      .then((res) => {
        if (res.error?.message) {
          throw new Error(res.error.message);
        }

        if (res.data?.submitTalentNomination) {
          setSearchParams(
            (params) => {
              params.delete("step");
              return params;
            },
            { state: { submitting: true } },
          );
          return;
        }

        throw new Error(intl.formatMessage(errorMessages.error));
      })
      .catch((error: Error) => {
        const messageDescriptor =
          tryFindMessageDescriptor(error.message) ??
          defineMessage({
            defaultMessage: "Error submitting talent nomination",
            id: "afkBMh",
            description:
              "Error message displayed when a talent nomination could not be submitted",
          });
        toast.error(intl.formatMessage(messageDescriptor));
      });
  };

  return [updating || submitting, { update, submit }];
};

export default useMutations;
