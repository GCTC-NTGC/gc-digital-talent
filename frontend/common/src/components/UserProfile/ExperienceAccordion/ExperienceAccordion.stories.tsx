import React from "react";
import { Story, Meta } from "@storybook/react";
import { generators } from "../../../fakeData/fakeExperiences";
import { Applicant } from "../../../api/generated";
import ExperienceAccordion, { AccordionProps } from "./ExperienceAccordion";

// required to define for unknown experience instance
const sampleApp: Applicant = { email: "blank", id: "blank" };
const theId = "blank";

export default {
  component: ExperienceAccordion,
  title: "Experience Accordion",
  args: {},
} as Meta;

const AccordionTemplate: Story<AccordionProps> = (args) => {
  return <ExperienceAccordion {...args} />;
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
  experience: generators.awardExperiences()[0],
};
AccordionAwardWithEdit.args = {
  ...AccordionAward.args,
  editPaths,
};

AccordionCommunity.args = {
  experience: generators.communityExperiences()[0],
};
AccordionCommunityWithEdit.args = {
  ...AccordionCommunity.args,
  editPaths,
};

AccordionEducation.args = {
  experience: generators.educationExperiences()[0],
};
AccordionEducationWithEdit.args = {
  ...AccordionEducation.args,
  editPaths,
};

AccordionPersonal.args = {
  experience: generators.personalExperiences()[0],
};
AccordionPersonalWithEdit.args = {
  ...AccordionPersonal.args,
  editPaths,
};

AccordionWork.args = {
  experience: generators.workExperiences()[0],
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
