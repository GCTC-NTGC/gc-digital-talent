import { Meta, StoryFn } from "@storybook/react";
import { faker } from "@faker-js/faker/locale/en";

import {
  fakePoolCandidates,
  fakeExperiences,
} from "@gc-digital-talent/fake-data";
import { notEmpty } from "@gc-digital-talent/helpers";
import {
  Application_PoolCandidateFragment as ApplicationPoolCandidateFragmentType,
  makeFragmentData,
} from "@gc-digital-talent/graphql";

import {
  ApplicationSkills,
  ApplicationSkillsExperience_Fragment,
  ApplicationSkillsProps,
} from "./ApplicationSkillsPage";

faker.seed(0);

const fakePoolCandidate = fakePoolCandidates(
  1,
)[0] as ApplicationPoolCandidateFragmentType;
fakePoolCandidate.submittedAt = null;
const fakeUser = fakePoolCandidate.user;
const mockExperiences = fakeExperiences(5);
const experienceSkills = mockExperiences
  .filter(notEmpty)
  .map((experience) => experience.skills)
  .filter(notEmpty)
  .flatMap((skill) => skill);

const noSkills: ApplicationSkillsProps = {
  application: {
    ...fakePoolCandidate,
    user: {
      ...fakeUser,
      experiences: mockExperiences,
    },
  },
  experiencesQuery: mockExperiences.map((e) =>
    makeFragmentData(e, ApplicationSkillsExperience_Fragment),
  ),
};

const hasExperiencesProps: ApplicationSkillsProps = {
  application: {
    ...fakePoolCandidate,
    user: {
      ...fakeUser,
      experiences: mockExperiences,
    },
    pool: {
      ...fakePoolCandidate.pool,
      poolSkills: experienceSkills.map((skill) => ({
        id: faker.string.uuid(),
        ...faker.helpers.arrayElement(
          fakePoolCandidate?.pool?.poolSkills ?? [],
        ),
        skill,
      })),
    },
  },
  experiencesQuery: mockExperiences.map((e) =>
    makeFragmentData(e, ApplicationSkillsExperience_Fragment),
  ),
};

export default {
  component: ApplicationSkills,
} as Meta<typeof ApplicationSkills>;

export const NoSkills = {
  args: noSkills,
};

export const HasExperiences = {
  args: hasExperiencesProps,
};
