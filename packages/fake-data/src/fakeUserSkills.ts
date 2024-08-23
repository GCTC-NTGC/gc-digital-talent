import { faker } from "@faker-js/faker/locale/en";
import { UniqueEnforcer } from "enforce-unique";

import {
  Skill,
  SkillLevel,
  User,
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
  user: User,
  experiences: AnyGeneratedExperience[],
  uniqueEnforcerId: UniqueEnforcer,
  index: number,
) => {
  faker.seed(index); // repeatable results

  const uniqueId = uniqueEnforcerId.enforce(() => {
    return faker.string.uuid();
  });
  return {
    __typename: "UserSkill" as UserSkill["__typename"],
    id: uniqueId,
    skill,
    user,
    skillLevel: faker.helpers.arrayElement<SkillLevel | undefined>([
      SkillLevel.Beginner,
      SkillLevel.Advanced,
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
      : undefined,
  };
};

export default (
  numToGenerate = 15,
  skill: Skill = randomSkill,
  user = mockUser,
  experiences: AnyGeneratedExperience[] = [],
): UserSkill[] => {
  const uniqueEnforcerId = new UniqueEnforcer(); // Ensure unique IDs

  return [...Array<number>(numToGenerate)].map((_x, index) =>
    generateUserSkill(skill, user, experiences, uniqueEnforcerId, index),
  );
};
