import { faker } from "@faker-js/faker/locale/en";
import { UniqueEnforcer } from "enforce-unique";

import type { Skill, User } from "@gc-digital-talent/graphql/schema-types";
import {
  SkillLevel,
  WhenSkillUsed,
} from "@gc-digital-talent/graphql/schema-types";

import fakeUsers from "./fakeUsers";
import { getStaticSkills } from "./fakeSkills";
import type { AnyGeneratedExperience } from "./fakeExperiences";

const staticSkills = getStaticSkills();
const randomSkill = faker.helpers.arrayElement(staticSkills);
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
    __typename: "UserSkill" as const,
    id: uniqueId,
    skill,
    user,
    topSkillsRank: null,
    improveSkillsRank: null,
    skillLevel: faker.helpers.arrayElement<SkillLevel | null>([
      SkillLevel.Beginner,
      SkillLevel.Advanced,
      SkillLevel.Intermediate,
      SkillLevel.Lead,
      null,
    ]),
    whenSkillUsed: faker.helpers.arrayElement<WhenSkillUsed | null>([
      WhenSkillUsed.Current,
      WhenSkillUsed.Past,
      null,
    ]),
    experiences: experiences.length
      ? faker.helpers.arrayElements<AnyGeneratedExperience>(experiences)
      : null,
  };
};

export default (
  numToGenerate = 15,
  skill: Skill = randomSkill,
  user = mockUser,
  experiences: AnyGeneratedExperience[] = [],
) => {
  const uniqueEnforcerId = new UniqueEnforcer(); // Ensure unique IDs

  return Array.from({ length: numToGenerate }, (_x, index) =>
    generateUserSkill(skill, user, experiences, uniqueEnforcerId, index),
  );
};
