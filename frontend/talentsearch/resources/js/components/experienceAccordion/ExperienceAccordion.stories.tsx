import React from "react";
import { Story, Meta } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import ExperienceAccordion, { AccordionProps } from "./ExperienceAccordion";

export default {
  component: ExperienceAccordion,
  title: "Experience Accordion",
  args: {},
} as Meta;

const AccordionTemplate: Story<AccordionProps> = (args) => {
  return <ExperienceAccordion {...args} />;
};

export const AccordionAwardExample = AccordionTemplate.bind({});
export const AccordionCommunityExample = AccordionTemplate.bind({});
export const AccordionEducationExample = AccordionTemplate.bind({});
export const AccordionPersonalExample = AccordionTemplate.bind({});
export const AccordionWorkExample = AccordionTemplate.bind({});

AccordionAwardExample.args = {
  anExperience: {
    experienceType: "AwardExperience",
    awardedDate: "September 2012",
    title: "Best Manager",
    issuedBy: "The Government",
    awardedTo: "Me",
    awardedScope: "National",
  },
};

AccordionCommunityExample.args = {
  anExperience: {
    experienceType: "CommunityExperience",
    startDate: "September 2010",
    role: "Boss",
    organization: "The Organization",
    title: "title",
    project: "The Project",
  },
};

AccordionEducationExample.args = {
  anExperience: {
    experienceType: "EducationExperience",
    startDate: "September 2010",
    areaStudy: "Mathematics",
    institution: "Greatest University",
    type: "Bachelor's",
    status: "In Progress",
  },
};

AccordionPersonalExample.args = {
  anExperience: {
    experienceType: "PersonalExperience",
    startDate: "September 2010",
    endDate: "October 2010",
    title: "Confidant",
    description: "blah blah blah",
  },
};

AccordionWorkExample.args = {
  anExperience: {
    experienceType: "WorkExperience",
    startDate: "September 2010",
    endDate: "October 2010",
    role: "Manager",
    organization: "Bank",
    division: "Team Alpha",
  },
};
