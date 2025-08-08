import { useMutation } from "urql";

import {
  AssessmentResultType,
  graphql,
  Scalars,
} from "@gc-digital-talent/graphql";

import { FormValues } from "./types";
import {
  convertFormValuesToApiCreateInput,
  convertFormValuesToApiUpdateInput,
} from "./utils";

const CreateAssessmentResult_Mutation = graphql(/* GraphQL */ `
  mutation CreateAssessmentResult(
    $createAssessmentResult: CreateAssessmentResultInput!
  ) {
    createAssessmentResult(createAssessmentResult: $createAssessmentResult) {
      id
    }
  }
`);

const UpdateAssessmentResult_Mutation = graphql(/* GraphQL */ `
  mutation UpdateAssessmentResult(
    $updateAssessmentResult: UpdateAssessmentResultInput!
  ) {
    updateAssessmentResult(updateAssessmentResult: $updateAssessmentResult) {
      id
    }
  }
`);

interface UseMutationArgs {
  isEducation?: boolean;
  resultId?: Scalars["UUID"]["output"];
  stepId: Scalars["UUID"]["output"];
  candidateId: Scalars["UUID"]["output"];
  poolSkillId?: Scalars["UUID"]["output"];
}

const useSaveHandler = ({
  isEducation,
  stepId,
  candidateId,
  poolSkillId,
  resultId,
}: UseMutationArgs) => {
  const [{ fetching: createFetching }, executeCreateMutation] = useMutation(
    CreateAssessmentResult_Mutation,
  );
  const [{ fetching: updateFetching }, executeUpdateMutation] = useMutation(
    UpdateAssessmentResult_Mutation,
  );

  const assessmentResultType = isEducation
    ? AssessmentResultType.Education
    : AssessmentResultType.Skill;

  const onSave = async (data: FormValues) => {
    try {
      let res;
      if (resultId) {
        res = await executeUpdateMutation({
          updateAssessmentResult: convertFormValuesToApiUpdateInput({
            formValues: data,
            assessmentResultId: resultId,
            assessmentResultType,
          }),
        });
      } else {
        res = await executeCreateMutation({
          createAssessmentResult: convertFormValuesToApiCreateInput({
            formValues: data,
            assessmentResultType,
            assessmentStepId: stepId,
            poolCandidateId: candidateId,
            poolSkillId,
          }),
        });
      }

      if (res.error) {
        return Promise.reject(res.error);
      }

      if (res.data) {
        return Promise.resolve(res.data);
      } else {
        return Promise.reject(new Error());
      }
    } catch {
      return Promise.reject(new Error());
    }
  };

  return { saving: createFetching || updateFetching, onSave };
};

export default useSaveHandler;
