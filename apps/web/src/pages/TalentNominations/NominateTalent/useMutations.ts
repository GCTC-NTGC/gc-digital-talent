import { useMutation } from "urql";
import { useIntl } from "react-intl";
import { useNavigate } from "react-router";

import {
  graphql,
  UpdateTalentNominationInput,
} from "@gc-digital-talent/graphql";
import { toast } from "@gc-digital-talent/toast";

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
  submit: (intent: SubmitIntent) => Promise<void> | void;
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
        if (!res.data?.updateTalentNomination) throw new Error();

        if (next && intent === "next-step") {
          await navigate(`${paths.talentNomiation(id)}?step=${next}`);
        }

        if (intent === "save-draft") {
          await navigate(paths.applicantDashboard());
        }
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
      await navigate(paths.applicantDashboard());
      return;
    }

    return executeSubmitMutation({ id })
      .then(async (res) => {
        if (!res.data?.submitTalentNomination) throw new Error();

        await navigate(`${paths.talentNomiation(id)}?step=success`);
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
