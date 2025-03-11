import { useMutation } from "urql";
import { useIntl } from "react-intl";
import { useNavigate } from "react-router";

import {
  graphql,
  TalentNominationStep,
  UpdateTalentNominationInput,
} from "@gc-digital-talent/graphql";
import { toast } from "@gc-digital-talent/toast";

import useRequiredParams from "~/hooks/useRequiredParams";
import useRoutes from "~/hooks/useRoutes";

import { RouteParams, SubmitIntent } from "./types";

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

interface TalentNominationMutations {
  update: (
    talentNomination: UpdateTalentNominationInput,
    intent: SubmitIntent,
    nextStep?: TalentNominationStep,
  ) => Promise<void>;
}
type UseMutationsReturn = [boolean, TalentNominationMutations];

const useMutations = (): UseMutationsReturn => {
  const intl = useIntl();
  const { id } = useRequiredParams<RouteParams>("id");
  const paths = useRoutes();
  const navigate = useNavigate();
  const [{ fetching }, executeUpdateMutation] = useMutation(
    NominateTalentUpdate_Mutation,
  );

  const update: TalentNominationMutations["update"] = async (
    talentNomination,
    intent,
    nextStep,
  ) => {
    return executeUpdateMutation({ id, talentNomination })
      .then(async (res) => {
        if (!res.data?.updateTalentNomination) throw new Error();

        if (nextStep && intent === "next-step") {
          await navigate(`${paths.talentNomiation(id)}?step=${nextStep}`);
        }

        if (intent === "save-draft") {
          await navigate(paths.applicantDashboard());
        }
      })
      .catch(() => {
        toast.error(
          intl.formatMessage({
            defaultMessage: "Error update talent nomination",
            id: "x8CORP",
            description:
              "Error message displayed when a talent nomination could not be updated",
          }),
        );
      });
  };

  return [fetching, { update }];
};

export default useMutations;
