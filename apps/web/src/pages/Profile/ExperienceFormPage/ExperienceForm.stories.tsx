import type { Meta, StoryFn } from "@storybook/react";

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
    experienceType: "award",
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
    communitiesQuery={[]}
  />
);

export const IndividualExperienceForm = TemplateExperienceFormForm.bind({});
