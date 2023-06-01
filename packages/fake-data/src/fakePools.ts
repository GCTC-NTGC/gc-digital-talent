import { faker } from "@faker-js/faker";
import pick from "lodash/pick";

import {
  FAR_FUTURE_DATE,
  FAR_PAST_DATE,
  PAST_DATE,
} from "@gc-digital-talent/date-helpers";

import {
  PoolStatus,
  Classification,
  Pool,
  PoolLanguage,
  User,
  UserPublicProfile,
  PoolStream,
  PublishingGroup,
  SecurityStatus,
  Skill,
} from "@gc-digital-talent/graphql";

import fakeUsers from "./fakeUsers";
import fakeClassifications from "./fakeClassifications";
import fakeSkillFamilies from "./fakeSkillFamilies";
import fakeSkills from "./fakeSkills";
import toLocalizedString from "./fakeLocalizedString";

const generatePool = (
  users: User[],
  skills: Skill[],
  classifications: Classification[],
  englishName = "",
  frenchName = "",
): Pool => {
  faker.setLocale("en");

  const ownerUser: User = faker.helpers.arrayElement<User>(users);
  return {
    id: faker.datatype.uuid(),
    owner: pick(ownerUser, [
      "id",
      "email",
      "firstName",
      "lastName",
    ]) as UserPublicProfile,
    name: {
      en: englishName || `${faker.company.catchPhrase()} EN`,
      fr: frenchName || `${faker.company.catchPhrase()} FR`,
    },
    classifications:
      faker.helpers.arrayElements<Classification>(classifications),
    keyTasks: toLocalizedString(faker.lorem.paragraphs()),
    stream: faker.helpers.arrayElement<PoolStream>(Object.values(PoolStream)),
    processNumber: faker.helpers.maybe(() => faker.lorem.word()),
    publishingGroup: faker.helpers.maybe(() =>
      faker.helpers.arrayElement(Object.values(PublishingGroup)),
    ),
    language: faker.helpers.arrayElement(Object.values(PoolLanguage)),
    location: toLocalizedString(faker.address.cityName()),
    status: faker.helpers.arrayElement(Object.values(PoolStatus)),
    essentialSkills: faker.helpers.arrayElements(
      skills,
      faker.datatype.number({
        max: 10,
      }),
    ),
    closingDate: faker.date
      .between(FAR_PAST_DATE, FAR_FUTURE_DATE)
      .toISOString(),
    publishedAt: faker.date.between(FAR_PAST_DATE, PAST_DATE).toISOString(),
    nonessentialSkills: faker.helpers.arrayElements(
      skills,
      faker.datatype.number({
        max: 10,
      }),
    ),
    securityClearance: faker.helpers.arrayElement(
      Object.values(SecurityStatus),
    ),
    yourImpact: toLocalizedString(faker.lorem.paragraphs()),
  };
};

export default (
  numToGenerate = 10,
  skills = fakeSkills(100, fakeSkillFamilies(6)),
  classifications = fakeClassifications(),
): Pool[] => {
  const users = fakeUsers();
  faker.seed(0); // repeatable results
  faker.setLocale("en");

  return [...Array(numToGenerate)].map((index) => {
    switch (index) {
      case 0:
        return generatePool(users, skills, classifications, "CMO", "CMO");
      case 1:
        return generatePool(
          users,
          skills,
          classifications,
          "IT Apprenticeship Program for Indigenous Peoples",
          "Programme d’apprentissage en TI pour les personnes autochtones",
        );
      default:
        return generatePool(users, skills, classifications);
    }
  });
};
