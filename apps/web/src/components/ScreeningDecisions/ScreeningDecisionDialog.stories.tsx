import { Meta, StoryFn } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import {
  MockGraphqlDecorator,
  OverlayOrDialogDecorator,
} from "@gc-digital-talent/storybook-helpers";
import {
  fakeAssessmentSteps,
  fakeExperiences,
  fakeLocalizedEnum,
  fakePoolCandidates,
  fakePoolSkills,
  fakeSkills,
  fakeUserSkills,
  toLocalizedEnum,
} from "@gc-digital-talent/fake-data";
import {
  AssessmentDecision,
  AssessmentDecisionLevel,
  AssessmentResultJustification,
  AssessmentStepType,
  EducationRequirementOption,
  User,
} from "@gc-digital-talent/graphql";

import { ScreeningDecisionDialog } from "./ScreeningDecisionDialog";

const assessmentStep = fakeAssessmentSteps(1)[0];
const poolCandidate = fakePoolCandidates(1)[0];
const experience = fakeExperiences(1)[0];
const poolSkill = fakePoolSkills(1)[0];
const skill = poolSkill?.skill ? poolSkill.skill : fakeSkills(1)[0];
experience.skills?.push(skill);
poolCandidate.user.experiences?.push(experience);
poolCandidate.user.userSkills?.push(fakeUserSkills(1, skill)[0]);

const profileSnapshot: User = {
  id: poolCandidate.user.id,
  firstName: poolCandidate.user.firstName,
  experiences: [experience],
  poolCandidates: [
    {
      ...poolCandidate,
      educationRequirementOption: toLocalizedEnum(
        experience.__typename === "EducationExperience"
          ? EducationRequirementOption.Education
          : EducationRequirementOption.AppliedWork,
      ),
      screeningQuestionResponses: [
        {
          id: "494effde-1168-44e1-8130-9775af800975",
          answer:
            "Impedit consectetur sit quia aut laboriosam corporis. Nam esse voluptatem tempora explicabo aut ipsum. Hic pariatur quod omnis qui reiciendis doloribus. Modi praesentium beatae adipisci sequi est corrupti aliquam.",
          screeningQuestion: {
            id: "673782a9-e754-4538-96af-7c4462c6b7e9",
            question: {
              en: "Labore eum alias ea ratione cum nam. EN?",
              fr: "Labore eum alias ea ratione cum nam. FR?",
            },
            sortOrder: 1,
          },
        },
        {
          id: "ab2a2b47-527c-46d5-b366-f7e9563e10e8",
          answer:
            "Eos facilis et esse asperiores iste nihil maxime. Qui quis omnis aut maiores consequatur hic. Nobis eligendi consectetur ipsum magni saepe quia. Eum sed hic aliquam voluptas incidunt illo architecto.",
          screeningQuestion: {
            id: "8ecf9391-8773-4c2b-b120-813dbb721e09",
            question: {
              en: "Architecto eum veritatis atque et. EN?",
              fr: "Architecto eum veritatis atque et. FR?",
            },
            sortOrder: 2,
          },
        },
        {
          id: "b2129ca9-6c57-4e9d-a7f3-e0a0cc1e466e",
          answer:
            "Nam delectus id sed molestias cum dolorem nostrum enim. Praesentium non reprehenderit suscipit placeat est sed ducimus. Officiis alias amet beatae aspernatur id. Delectus possimus officia explicabo enim amet.",
          screeningQuestion: {
            id: "7cd8970d-cc4b-4128-b94d-bac0952c6c0b",
            question: {
              en: "Rerum vel nesciunt qui ea fuga libero. EN?",
              fr: "Rerum vel nesciunt qui ea fuga libero. FR?",
            },
            sortOrder: 3,
          },
        },
      ],
      educationRequirementExperiences: [experience],
    },
  ],
};
poolCandidate.profileSnapshot = JSON.stringify(profileSnapshot);

export default {
  component: ScreeningDecisionDialog,
  decorators: [OverlayOrDialogDecorator, MockGraphqlDecorator],
  args: {
    assessmentStep,
    poolCandidate,
    poolSkill,
    onSubmit: action("Submit Form"),
    isOpen: true,
  },
  parameters: {
    apiResponses: {
      ScreeningOptions: {
        data: {
          justifications: fakeLocalizedEnum(AssessmentResultJustification),
          decisions: fakeLocalizedEnum(AssessmentDecision),
          decisionLevels: fakeLocalizedEnum(AssessmentDecisionLevel),
        },
      },
    },
  },
} satisfies Meta<typeof ScreeningDecisionDialog>;

const Template: StoryFn<typeof ScreeningDecisionDialog> = (args) => {
  return <ScreeningDecisionDialog {...args} />;
};

export const EducationRequirement = Template.bind({});
EducationRequirement.args = {
  assessmentStep: undefined,
  poolCandidate,
  poolSkill,
  isOpen: true,
};
export const ApplicationScreening = Template.bind({});
ApplicationScreening.args = {
  assessmentStep: fakeAssessmentSteps(
    1,
    AssessmentStepType.ApplicationScreening,
  )[0],
  poolCandidate,
  poolSkill,
  isOpen: true,
};
export const ScreeningQuestions = Template.bind({});
ScreeningQuestions.args = {
  assessmentStep: fakeAssessmentSteps(
    1,
    AssessmentStepType.ScreeningQuestionsAtApplication,
  )[0],
  poolCandidate,
  poolSkill,
  isOpen: true,
};
export const Generic = Template.bind({});
Generic.args = {
  assessmentStep: fakeAssessmentSteps(
    1,
    AssessmentStepType.InterviewFollowup,
  )[0],
  poolCandidate,
  poolSkill,
  isOpen: true,
};
export const WithInitialValues = Template.bind({});
WithInitialValues.args = {
  assessmentStep: fakeAssessmentSteps(
    1,
    AssessmentStepType.ApplicationScreening,
  )[0],
  poolCandidate,
  poolSkill,
  initialValues: {
    assessmentDecision: AssessmentDecision.Successful,
    justifications: [],
    assessmentDecisionLevel: AssessmentDecisionLevel.AboveAndBeyondRequired,
    skillDecisionNotes:
      "This applicant went above and beyond our expectations.",
  },
  isOpen: true,
};
