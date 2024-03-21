import React from "react";
import { Meta, StoryFn } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import { OverlayOrDialogDecorator } from "@gc-digital-talent/storybook-helpers";
import {
  fakeAssessmentSteps,
  fakeExperiences,
  fakePoolCandidates,
  fakePoolSkills,
  fakeSkills,
  fakeUserSkills,
} from "@gc-digital-talent/fake-data";
import {
  AssessmentDecision,
  AssessmentDecisionLevel,
  AssessmentStepType,
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

const profileSnapshot = {
  id: poolCandidate.user.id,
  firstName: poolCandidate.user.firstName,
  experiences: [
    {
      id: "11e06444-19f3-41bc-a8c0-557f2391791a",
      role: "Residential Defender",
      skills: [
        {
          id: "b9d2f8c5-c24e-4993-8e6d-10dd046fd387",
          key: "cobol",
          name: { en: "COBOL", fr: "COBOL" },
          keywords: { en: null, fr: null },
          description: {
            en: "Demonstrated ability to apply concrete knowledge of this language to develop a variety of projects.",
            fr: "Capacité démontrée à appliquer des connaissances concrètes de cette langue pour développer une variété de projets.",
          },
          experienceSkillRecord: { details: "application justification" },
        },
        {
          id: "759ec8e0-6a4e-45e8-9862-98db5a275d78",
          key: "it_software_and_hardware_security_requirements",
          name: {
            en: "IT Software and Hardware Security Requirements",
            fr: "Exigences en matière de sécurité des logiciels et du matériel informatique",
          },
          keywords: { en: [], fr: [] },
          description: { en: "", fr: "" },
          experienceSkillRecord: { details: "application justification" },
        },
        {
          id: "4dae9e8c-aea8-4829-b5a3-0e75d83614ae",
          key: "web_development",
          name: { en: "Web Development", fr: "Développement Web" },
          keywords: { en: null, fr: null },
          description: {
            en: "Demonstrated ability to build web applications using JavaScript and a server-side language such as, but not limited to, PHP or Python.",
            fr: "Capacité démontrée à créer des applications Web à l'aide de JavaScript et d'un langage côté serveur tel que, sans toutefois s'y limiter, PHP ou Python.",
          },
          experienceSkillRecord: { details: "application justification" },
        },
        {
          id: "5828011e-8f66-4606-8cc1-fcbcfe1838e2",
          key: "cloud_architecture",
          name: { en: "Cloud Architecture", fr: "Architecture infonuagique" },
          keywords: { en: null, fr: null },
          description: {
            en: "Demonstrated ability to describe and document how different components and capabilities connect to build an online platform.",
            fr: "Capacité démontrée à décrire et à documenter la façon dont différents composants et capacités se connectent pour créer une plateforme en ligne.",
          },
          experienceSkillRecord: { details: "application justification" },
        },
      ],
      details: "additional details",
      endDate: null,
      division: null,
      startDate: "2020-01-01",
      __typename: "WorkExperience",
      organization: "Company",
    },
  ],
  poolCandidates: [
    {
      id: poolCandidate.id,
      pool: {
        id: poolCandidate.pool.id,
        name: poolCandidate.pool.name,
        stream: poolCandidate.pool.stream,
        classifications: poolCandidate.pool.classifications,
      },
      status: "PLACED_CASUAL",
      educationRequirementOption: "EDUCATION",
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
      educationRequirementExperiences: [
        {
          id: "00c3860d-5a8a-49df-aee9-3d9a8ba65d59",
          type: "OTHER",
          skills: [],
          status: "IN_PROGRESS",
          details:
            "Inventore aut autem eligendi aliquam optio culpa. Molestiae velit nostrum impedit sunt enim nisi sapiente. Iste tenetur saepe aut cum dolores non est.",
          endDate: "2022-10-30",
          startDate: "2021-08-28",
          __typename: "EducationExperience",
          areaOfStudy: "Professional Photographer",
          institution: "Collier, Cummings and Ankunding",
          thesisTitle: "incubate leading-edge mindshare",
        },
      ],
    },
  ],
};
poolCandidate.profileSnapshot = JSON.stringify(profileSnapshot);

export default {
  component: ScreeningDecisionDialog,
  title: "Components/Screening Decisions/ScreeningDecisionDialog",
  decorators: [OverlayOrDialogDecorator],
  args: {
    assessmentStep,
    poolCandidate,
    poolSkill,
    onSubmit: action("Submit Form"),
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
};
export const ApplicationScreening = Template.bind({});
ApplicationScreening.args = {
  assessmentStep: fakeAssessmentSteps(
    1,
    AssessmentStepType.ApplicationScreening,
  )[0],
  poolCandidate,
  poolSkill,
};
export const ScreeningQuestions = Template.bind({});
ScreeningQuestions.args = {
  assessmentStep: fakeAssessmentSteps(
    1,
    AssessmentStepType.ScreeningQuestionsAtApplication,
  )[0],
  poolCandidate,
  poolSkill,
};
export const Generic = Template.bind({});
Generic.args = {
  assessmentStep: fakeAssessmentSteps(
    1,
    AssessmentStepType.InterviewFollowup,
  )[0],
  poolCandidate,
  poolSkill,
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
    assessmentNotes: undefined,
    otherJustificationNotes: undefined,
  },
};
