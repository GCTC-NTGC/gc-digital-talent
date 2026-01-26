import type { Meta, StoryFn } from "@storybook/react-vite";

import { getStaticSkills } from "@gc-digital-talent/fake-data";
import { makeFragmentData } from "@gc-digital-talent/graphql";

import {
  ExperienceForm,
  ExperienceFormSkill_Fragment,
} from "./ExperienceFormPage";

const skillData = getStaticSkills();
const skillFragments = skillData.map((skill) =>
  makeFragmentData(skill, ExperienceFormSkill_Fragment),
);

export default {
  component: ExperienceForm,
  args: {
    skillsQuery: skillFragments,
    userId: "user-id",
  },
} as Meta;

const TemplateExperienceFormForm: StoryFn<typeof ExperienceForm> = ({
  experienceType,
  skillsQuery,
  userId,
}) => (
  <ExperienceForm
    userId={userId}
    experienceType={experienceType}
    skillsQuery={skillsQuery}
    organizationSuggestions={[]}
  />
);

export const AwardExperienceForm = TemplateExperienceFormForm.bind({});
AwardExperienceForm.args = {
  experienceType: "award",
};

export const CommunityExperienceForm = TemplateExperienceFormForm.bind({});
CommunityExperienceForm.args = {
  experienceType: "community",
};

export const EducationExperienceForm = TemplateExperienceFormForm.bind({});
EducationExperienceForm.args = {
  experienceType: "education",
};

export const PersonalExperienceForm = TemplateExperienceFormForm.bind({});
PersonalExperienceForm.args = {
  experienceType: "personal",
};

export const WorkExperienceForm = TemplateExperienceFormForm.bind({});
WorkExperienceForm.args = {
  experienceType: "work",
};
