import { faker } from "@faker-js/faker";
import { BIG_DATE, SMALL_DATE } from "@common/helpers/dateUtils";
import { toLocalizedString } from "../helpers/fake";
import {
  AdvertisementStatus,
  Classification,
  PoolAdvertisement,
  PoolAdvertisementLanguage,
  PoolStatus,
  SecurityStatus,
  Skill,
} from "../api/generated";
import fakeSkillFamilies from "./fakeSkillFamilies";
import fakeSkills from "./fakeSkills";
import fakeClassifications from "./fakeClassifications";

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
    // assetCriteria?: Maybe<Array<Maybe<CmoAsset>>>;
    classifications: [faker.helpers.arrayElement(classifications)],
    description: toLocalizedString(faker.lorem.sentence()),
    // essentialCriteria?: Maybe<Array<Maybe<CmoAsset>>>;
    essentialSkills: faker.helpers.arrayElements(
      skills,
      faker.datatype.number({
        max: 10,
      }),
    ),
    expiryDate: faker.date.between(SMALL_DATE, BIG_DATE).toISOString(),
    id: faker.datatype.uuid(),
    isPublished: faker.datatype.boolean(),
    keyTasks: toLocalizedString(faker.lorem.paragraphs()),
    name: toLocalizedString(faker.company.catchPhrase()),
    nonessentialSkills: faker.helpers.arrayElements(
      skills,
      faker.datatype.number({
        max: 10,
      }),
    ),
    // operationalRequirements?: Maybe<Array<Maybe<OperationalRequirement>>>;
    securityClearance: faker.helpers.arrayElement(
      Object.values(SecurityStatus),
    ),
    // status: faker.helpers.arrayElement(Object.values(PoolStatus)),
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
