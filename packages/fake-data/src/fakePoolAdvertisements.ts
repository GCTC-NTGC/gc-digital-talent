import { faker } from "@faker-js/faker";

import {
  FAR_FUTURE_DATE,
  FAR_PAST_DATE,
  PAST_DATE,
} from "@gc-digital-talent/date-helpers";

import {
  AdvertisementStatus,
  Classification,
  PoolAdvertisement,
  PoolAdvertisementLanguage,
  PoolStream,
  SecurityStatus,
  Skill,
} from "@gc-digital-talent/graphql";

import fakeSkillFamilies from "./fakeSkillFamilies";
import fakeSkills from "./fakeSkills";
import fakeClassifications from "./fakeClassifications";
import toLocalizedString from "./fakeLocalizedString";

const generatePoolAdvertisement = (
  skills: Skill[],
  classifications: Classification[],
): PoolAdvertisement => {
  return {
    advertisementLanguage: faker.helpers.arrayElement(
      Object.values(PoolAdvertisementLanguage),
    ),
    advertisementLocation: toLocalizedString(faker.address.cityName()),
    advertisementStatus: faker.helpers.arrayElement(
      Object.values(AdvertisementStatus),
    ),
    classifications: [faker.helpers.arrayElement(classifications)],
    description: toLocalizedString(faker.lorem.sentence()),
    essentialSkills: faker.helpers.arrayElements(
      skills,
      faker.datatype.number({
        max: 10,
      }),
    ),
    closingDate: faker.date
      .between(FAR_PAST_DATE, FAR_FUTURE_DATE)
      .toISOString(),
    id: faker.datatype.uuid(),
    publishedAt: faker.date.between(FAR_PAST_DATE, PAST_DATE).toISOString(),
    keyTasks: toLocalizedString(faker.lorem.paragraphs()),
    name: toLocalizedString(faker.company.catchPhrase()),
    nonessentialSkills: faker.helpers.arrayElements(
      skills,
      faker.datatype.number({
        max: 10,
      }),
    ),
    securityClearance: faker.helpers.arrayElement(
      Object.values(SecurityStatus),
    ),
    stream: faker.helpers.arrayElement<PoolStream>(Object.values(PoolStream)),
    yourImpact: toLocalizedString(faker.lorem.paragraphs()),
  };
};

export default (
  numToGenerate = 10,
  skills = fakeSkills(100, fakeSkillFamilies(6)),
  classifications = fakeClassifications(),
): PoolAdvertisement[] => {
  faker.seed(0); // repeatable results
  faker.setLocale("en");

  return [...Array(numToGenerate)].map(() =>
    generatePoolAdvertisement(skills, classifications),
  );
};
