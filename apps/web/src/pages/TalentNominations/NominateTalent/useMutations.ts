import { useMutation } from "urql";
import { useIntl } from "react-intl";
import { useNavigate } from "react-router";

import {
  graphql,
  UpdateTalentNominationInput,
} from "@gc-digital-talent/graphql";
import { toast } from "@gc-digital-talent/toast";
import { errorMessages } from "@gc-digital-talent/i18n";

import useRequiredParams from "~/hooks/useRequiredParams";
import useRoutes from "~/hooks/useRoutes";

import { RouteParams, SubmitIntent } from "./types";
import useCurrentStep from "./useCurrentStep";

const NominateTalentUpdate_Mutation = graphql(/* GraphQL */ `
  mutation NominateTalentUpdate(
    $id: UUID!
    $talentNomination: UpdateTalentNominationInput!
  ) {
    updateTalentNomination(id: $id, talentNomination: $talentNomination) {
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

const useMutations = (): UseMutationsReturn => {
  const intl = useIntl();
  const { id } = useRequiredParams<RouteParams>("id");
  const paths = useRoutes();
  const navigate = useNavigate();
  const { next } = useCurrentStep();
  const [{ fetching: updating }, executeUpdateMutation] = useMutation(
    NominateTalentUpdate_Mutation,
  );
  const [{ fetching: submitting }, executeSubmitMutation] = useMutation(
    NominateTalentSubmit_Mutation,
  );

  const update: TalentNominationMutations["update"] = async (
    talentNomination,
    intent,
  ) => {
    return executeUpdateMutation({ id, talentNomination })
      .then(async (res) => {
        if (res.error?.message) {
          throw new Error(res.error.message);
        }

        if (res.data?.updateTalentNomination) {
          if (next && intent === "next-step") {
            await navigate(`${paths.talentNomiation(id)}?step=${next}`);
          }

          if (intent === "save-draft") {
            await navigate(paths.applicantDashboard());
          }

          return;
        }

        throw new Error(intl.formatMessage(errorMessages.error));
      })
      .catch(() => {
        toast.error(
          intl.formatMessage({
            defaultMessage: "Error updating talent nomination",
            id: "UlK+Qm",
            description:
              "Error message displayed when a talent nomination could not be updated",
          }),
        );
      });
  };

  const submit: TalentNominationMutations["submit"] = async (intent) => {
    if (intent === "save-draft") {
      return await navigate(paths.applicantDashboard());
    }

    return executeSubmitMutation({ id })
      .then(async (res) => {
        if (res.error?.message) {
          throw new Error(res.error.message);
        }

        if (res.data?.submitTalentNomination) {
          await navigate(paths.talentNomiation(id));
          return;
        }

        throw new Error(intl.formatMessage(errorMessages.error));
      })
      .catch(() => {
        toast.error(
          intl.formatMessage({
            defaultMessage: "Error submitting talent nomination",
            id: "afkBMh",
            description:
              "Error message displayed when a talent nomination could not be submitted",
          }),
        );
      });
  };

  return [updating || submitting, { update, submit }];
};

export default useMutations;
