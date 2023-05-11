import React from "react";
import { Story, Meta } from "@storybook/react";

import { Accordion } from "@gc-digital-talent/ui";
import { experienceGenerators } from "@gc-digital-talent/fake-data";

import { Applicant } from "~/api/generated";

import ExperienceAccordion, { AccordionProps } from "./ExperienceAccordion";

// required to define for unknown experience instance
const sampleApp: Applicant = { email: "blank", id: "blank" };
const theId = "blank";

export default {
  component: ExperienceAccordion,
  title: "Components/User Profile/Experience Accordion",
  args: {},
} as Meta;

const AccordionTemplate: Story<AccordionProps> = ({
  experience,
  editPaths,
}) => {
  return (
    <Accordion.Root type="single" collapsible defaultValue={experience.id}>
      <ExperienceAccordion experience={experience} editPaths={editPaths} />
    </Accordion.Root>
  );
};

const editPaths = {
  awardUrl: () => "#",
  communityUrl: () => "#",
  educationUrl: () => "#",
  personalUrl: () => "#",
  workUrl: () => "#",
};

export const AccordionAward = AccordionTemplate.bind({});
export const AccordionAwardWithEdit = AccordionTemplate.bind({});
export const AccordionCommunity = AccordionTemplate.bind({});
export const AccordionCommunityWithEdit = AccordionTemplate.bind({});
export const AccordionEducation = AccordionTemplate.bind({});
export const AccordionEducationWithEdit = AccordionTemplate.bind({});
export const AccordionPersonal = AccordionTemplate.bind({});
export const AccordionPersonalWithEdit = AccordionTemplate.bind({});
export const AccordionWork = AccordionTemplate.bind({});
export const AccordionWorkWithEdit = AccordionTemplate.bind({});
export const AccordionUnknown = AccordionTemplate.bind({});
export const AccordionUnknownWithEdit = AccordionTemplate.bind({});

AccordionAward.args = {
  experience: experienceGenerators.awardExperiences()[0],
};
AccordionAwardWithEdit.args = {
  ...AccordionAward.args,
  editPaths,
};

AccordionCommunity.args = {
  experience: experienceGenerators.communityExperiences()[0],
};
AccordionCommunityWithEdit.args = {
  ...AccordionCommunity.args,
  editPaths,
};

AccordionEducation.args = {
  experience: experienceGenerators.educationExperiences()[0],
};
AccordionEducationWithEdit.args = {
  ...AccordionEducation.args,
  editPaths,
};

AccordionPersonal.args = {
  experience: experienceGenerators.personalExperiences()[0],
};
AccordionPersonalWithEdit.args = {
  ...AccordionPersonal.args,
  editPaths,
};

AccordionWork.args = {
  experience: experienceGenerators.workExperiences()[0],
};
AccordionWorkWithEdit.args = {
  ...AccordionWork.args,
  editPaths,
};

AccordionUnknown.args = {
  experience: {
    applicant: sampleApp,
    id: theId,
  },
};
AccordionUnknownWithEdit.args = {
  ...AccordionUnknown.args,
  editPaths,
};
