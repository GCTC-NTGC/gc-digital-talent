import React from "react";
import { Story, Meta } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import fakeExperiences, {
  fakerAward,
  fakerCommunity,
  fakerEducation,
  fakerPersonal,
  fakerWork,
} from "@common/fakeData/fakeExperiences";
import {
  Applicant,
  LocalizedString,
  Skill,
  Experience,
  ExperienceSkill,
  AwardedTo,
  AwardedScope,
  EducationType,
  EducationStatus,
} from "@common/api/generated";
import ExperienceAccordion, { AccordionProps } from "./ExperienceAccordion";

// lots of X requires Y filling things out and adding connecting Types/Components to one another
const sampleApp: Applicant = { email: "blank", id: "blank" };
const theId = "blank";
const theString: LocalizedString = { en: "The Skill" };
const theDescription: LocalizedString = { en: "The Description" };
const sampleSkill: Skill = {
  id: "blank",
  key: "blank",
  description: theDescription,
  name: theString,
};
const sampleExperienceInstance: Experience = {
  applicant: sampleApp,
  id: theId,
  // circular dependency here, between sampleExperienceInstance and sampleExperience
  // experienceSkills: [sampleExperience],
};
const sampleExperience: ExperienceSkill = {
  id: "blank",
  skill: sampleSkill,
  experience: sampleExperienceInstance,
};

// faker generates an experience section based off an argument and then pulls stuff out into variables to pass into something
const {
  __typename,
  organization,
  startDate,
  endDate,
  role,
  division,
  details,
} = fakerWork.generateWork(sampleApp, theId, sampleExperience);

// array of random experiences
console.log(fakeExperiences(10));

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
    applicant: sampleApp,
    id: theId,
    __typename: "AwardExperience",
    awardedDate: "September 2012",
    title: "Best Manager",
    issuedBy: "The Government",
    awardedTo: AwardedTo.Me,
    awardedScope: AwardedScope.National,
    experienceSkills: [
      {
        experience: sampleExperienceInstance,
        id: "",
        skill: sampleSkill,
        details: "Text and more text",
      },
    ],
    details:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
};

AccordionCommunityExample.args = {
  anExperience: {
    applicant: sampleApp,
    id: theId,
    __typename: "CommunityExperience",
    startDate: "September 2010",
    organization: "The Organization",
    title: "Big Boss",
    project: "The Project",
    experienceSkills: [
      {
        experience: sampleExperienceInstance,
        id: "",
        skill: sampleSkill,
        details: "Text and more text",
      },
    ],
  },
};

AccordionEducationExample.args = {
  anExperience: {
    applicant: sampleApp,
    id: theId,
    __typename: "EducationExperience",
    startDate: "September 2010",
    areaOfStudy: "Mathematics",
    institution: "Greatest University",
    type: EducationType.BachelorsDegree,
    status: EducationStatus.InProgress,
    experienceSkills: [
      {
        experience: sampleExperienceInstance,
        id: "",
        skill: sampleSkill,
        details: "Text and more text",
      },
    ],
  },
};

AccordionPersonalExample.args = {
  anExperience: {
    applicant: sampleApp,
    id: theId,
    __typename: "PersonalExperience",
    startDate: "September 2010",
    endDate: "October 2010",
    title: "Confidant",
    description: "blah blah blah",
    experienceSkills: [
      {
        experience: sampleExperienceInstance,
        id: "",
        skill: sampleSkill,
        details: "Text and more text",
      },
    ],
  },
};

AccordionWorkExample.args = {
  anExperience: {
    applicant: sampleApp,
    id: theId,
    __typename: "WorkExperience",
    startDate: "September 2010",
    endDate: "October 2010",
    role: "Manager",
    organization: "Bank",
    division: "Team Alpha",
    experienceSkills: [
      {
        experience: sampleExperienceInstance,
        id: "",
        skill: sampleSkill,
        details: "Text and more text",
      },
    ],
    details:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
};

AccordionUnknownExample.args = {
  anExperience: {
    applicant: sampleApp,
    id: theId,
    experienceSkills: [
      {
        experience: sampleExperienceInstance,
        id: "",
        skill: sampleSkill,
        details: "Text and more text",
      },
    ],
  },
};

// pass faker variables from near top to here
AccordionFaker.args = {
  anExperience: {
    applicant: sampleApp,
    id: theId,
    __typename,
    experienceSkills: [
      {
        experience: sampleExperienceInstance,
        id: "",
        skill: sampleSkill,
        details: "Text and more text",
      },
    ],
    organization,
    startDate,
    endDate,
    details,
    role,
    division,
  },
};
