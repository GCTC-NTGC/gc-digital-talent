import { faker } from "@faker-js/faker";
import { UniqueEnforcer } from "enforce-unique";

import {
  Skill,
  SkillLevel,
  UserSkill,
  WhenSkillUsed,
} from "@gc-digital-talent/graphql";

import fakeUsers from "./fakeUsers";
import { getStaticSkills } from "./fakeSkills";
import { AnyGeneratedExperience } from "./fakeExperiences";

const staticSkills = getStaticSkills();
const randomSkill = faker.helpers.arrayElement<Skill>(staticSkills);
const mockUser = fakeUsers(1)[0];

const generateUserSkill = (
  skill: Skill,
  experiences: AnyGeneratedExperience[],
  uniqueEnforcerId: UniqueEnforcer,
) => {
  const uniqueId = uniqueEnforcerId.enforce(() => {
    return faker.string.uuid();
  });
  return {
    __typename: undefined,
    id: uniqueId,
    skill,
    user: mockUser,
    skillLevel: faker.helpers.arrayElement<SkillLevel | undefined>([
      SkillLevel.Beginner,
      SkillLevel.Expert,
      SkillLevel.Intermediate,
      SkillLevel.Lead,
      undefined,
    ]),
    whenSkillUsed: faker.helpers.arrayElement<WhenSkillUsed | undefined>([
      WhenSkillUsed.Current,
      WhenSkillUsed.Past,
      undefined,
    ]),
    experiences: experiences.length
      ? faker.helpers.arrayElements<AnyGeneratedExperience>(experiences)
      : ([] as AnyGeneratedExperience[]),
  };
};

export default (
  numToGenerate = 15,
  skill: Skill = randomSkill,
  experiences: AnyGeneratedExperience[] = [],
): UserSkill[] => {
  faker.seed(0); // repeatable results
  const uniqueEnforcerId = new UniqueEnforcer(); // Ensure unique IDs

  return [...Array(numToGenerate)].map(() =>
    generateUserSkill(skill, experiences, uniqueEnforcerId),
  );
};
