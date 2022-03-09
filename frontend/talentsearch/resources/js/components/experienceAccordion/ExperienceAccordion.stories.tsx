import React from "react";
import { Story, Meta } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import fakeExperiences from "@common/fakeData/fakeExperiences";
import ExperienceAccordion, { AccordionProps } from "./ExperienceAccordion";

// faker generates an experience section based off an argument and then pulls stuff out into variables to pass into something
const {
  __typename,
  experienceSkills,
  institution,
  organization,
  description,
  title,
  startDate,
  endDate,
  // awarded
  awardedTo,
  awardedScope,
  awardedDate,
  issuedBy,
  organization,
  role,
  project,
  areaOfStudy,
  type,
  status,
  division,
  // for some reason the above don't exist on AnExperience apparently as they are underlined?
  details,
} = fakeExperiences("Education");

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
export const AccordionUnknownExample = AccordionTemplate.bind({});
export const AccordionFaker = AccordionTemplate.bind({});

AccordionAwardExample.args = {
  anExperience: {
    experienceType: "AwardExperience",
    awardedDate: "September 2012",
    title: "Best Manager",
    issuedBy: "The Government",
    awardedTo: "Me",
    awardedScope: "National",
    experienceSkills: [{ name: "Skill 1", description: "Text and more text" }],
    details:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
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
    experienceSkills: [
      { name: "Skill 1 ", description: "Text and more text" },
      { name: "Skill 2", description: "Text and more text" },
    ],
  },
};

AccordionEducationExample.args = {
  anExperience: {
    experienceType: "EducationExperience",
    startDate: "September 2010",
    areaOfStudy: "Mathematics",
    institution: "Greatest University",
    type: "Bachelor's",
    status: "In Progress",
    experienceSkills: [{ name: "Skill 1", description: "Text and more text" }],
  },
};

AccordionPersonalExample.args = {
  anExperience: {
    experienceType: "PersonalExperience",
    startDate: "September 2010",
    endDate: "October 2010",
    title: "Confidant",
    description: "blah blah blah",
    experienceSkills: [
      { name: "Skill 1", description: "Text and more text" },
      { name: "Skill 2", description: "Text and more text" },
      { name: "Skill 3", description: "Text and more text" },
    ],
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
    experienceSkills: [{ name: "Skill 1", description: "Text and more text" }],
    details:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
};

AccordionUnknownExample.args = {
  anExperience: {
    experienceType: "MusicalExperience",
    experienceSkills: [{ name: "Skill 1", description: "Text and more text" }],
  },
};

// pass faker variables from near top to here
AccordionFaker.args = {
  anExperience: {
    experienceType: __typename,
    experienceSkills: [],
    institution,
    organization,
    description,
    startDate,
    endDate,
    // details, // says that type null can't be assigned to this
    title,
    awardedTo,
    awardedScope,
    awardedDate,
    issuedBy,
    role,
    project,
    areaOfStudy,
    type,
    status,
    division,
  },
};
