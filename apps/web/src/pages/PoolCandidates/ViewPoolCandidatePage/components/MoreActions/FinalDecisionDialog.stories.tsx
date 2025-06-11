import { Meta } from "@storybook/react-vite";

import {
  fakePoolCandidates,
  fakePools,
  fakeSkills,
  toLocalizedEnum,
} from "@gc-digital-talent/fake-data";
import { OverlayOrDialogDecorator } from "@gc-digital-talent/storybook-helpers";
import {
  AssessmentDecision,
  AssessmentResult,
  AssessmentResultType,
  makeFragmentData,
} from "@gc-digital-talent/graphql";

import FinalDecisionDialog, {
  FinalDecisionDialog_Fragment,
} from "./FinalDecisionDialog";

export default {
  component: FinalDecisionDialog,
  decorators: [OverlayOrDialogDecorator],
  args: {
    defaultOpen: true,
  },
} as Meta;

const fakedCandidate = fakePoolCandidates(1)[0];
const fakedSkills = fakeSkills(3);
const fakedPool = fakePools(1, fakedSkills)[0];

/*
education result, success
skill 0, 1 success and 1 fail
skill 1, success
skill 2, not sure
*/
const candidateAssessmentResults: AssessmentResult[] = [
  {
    id: "education-result",
    assessmentResultType: AssessmentResultType.Education,
    assessmentDecision: toLocalizedEnum(AssessmentDecision.Successful),
  },
  {
    id: "skill-0-assessment-1",
    assessmentResultType: AssessmentResultType.Skill,
    assessmentDecision: toLocalizedEnum(AssessmentDecision.Unsuccessful),
    poolSkill: {
      id: "poolSkill-1",
      skill: {
        id: fakedSkills[0].id,
        category: fakedSkills[0].category,
        key: fakedSkills[0].key,
        name: fakedSkills[0].name,
      },
    },
  },
  {
    id: "skill-0-assessment-2",
    assessmentResultType: AssessmentResultType.Skill,
    assessmentDecision: toLocalizedEnum(AssessmentDecision.Successful),
    poolSkill: {
      id: "poolSkill-1",
      skill: {
        id: fakedSkills[0].id,
        category: fakedSkills[0].category,
        key: fakedSkills[0].key,
        name: fakedSkills[0].name,
      },
    },
  },
  {
    id: "skill-1-assessment-1",
    assessmentResultType: AssessmentResultType.Skill,
    assessmentDecision: toLocalizedEnum(AssessmentDecision.Successful),
    poolSkill: {
      id: "poolSkill-2",
      skill: {
        id: fakedSkills[1].id,
        category: fakedSkills[1].category,
        key: fakedSkills[1].key,
        name: fakedSkills[1].name,
      },
    },
  },
  {
    id: "skill-2-assessment-1",
    assessmentResultType: AssessmentResultType.Skill,
    assessmentDecision: toLocalizedEnum(AssessmentDecision.Hold),
    poolSkill: {
      id: "poolSkill-3",
      skill: {
        id: fakedSkills[2].id,
        category: fakedSkills[2].category,
        key: fakedSkills[2].key,
        name: fakedSkills[2].name,
      },
    },
  },
];

const poolCandidate = makeFragmentData(
  {
    id: fakedCandidate.id,
    status: fakedCandidate.status,
    expiryDate: fakedCandidate.expiryDate,
    pool: fakedPool,
    assessmentResults: candidateAssessmentResults,
  },
  FinalDecisionDialog_Fragment,
);

export const Default = {
  args: {
    poolCandidate,
  },
};
