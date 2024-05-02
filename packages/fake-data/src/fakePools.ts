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
  GeneralQuestion,
  ScreeningQuestion,
  AssessmentStepType,
  PoolSkillType,
  PoolSkill,
  SkillLevel,
} from "@gc-digital-talent/graphql";

import fakeScreeningQuestions from "./fakeScreeningQuestions";
import fakeGeneralQuestions from "./fakeGeneralQuestions";
import fakeUsers from "./fakeUsers";
import fakeClassifications from "./fakeClassifications";
import fakeSkillFamilies from "./fakeSkillFamilies";
import fakeSkills from "./fakeSkills";
import toLocalizedString from "./fakeLocalizedString";
import fakeAssessmentSteps from "./fakeAssessmentSteps";

const generatePool = (
  users: User[],
  skills: Skill[],
  classifications: Classification[],
  englishName = "",
  frenchName = "",
  essentialSkillCount = -1,
): Pool => {
  const ownerUser: User = faker.helpers.arrayElement<User>(users);
  const essentialSkills = faker.helpers.arrayElements(
    skills,
    essentialSkillCount > 0
      ? essentialSkillCount
      : faker.number.int({
          max: 10,
        }),
  );
  const nonessentialSkills = faker.helpers.arrayElements(
    skills,
    faker.number.int({
      max: 10,
    }),
  );
  const poolSkills: PoolSkill[] = [
    ...essentialSkills.map((skill) => {
      return {
        id: faker.string.uuid(),
        skill,
        requiredLevel: faker.helpers.arrayElement<SkillLevel>(
          Object.values(SkillLevel),
        ),
        type: PoolSkillType.Essential,
      };
    }),
    ...nonessentialSkills.map((skill) => {
      return {
        id: faker.string.uuid(),
        skill,
        requiredLevel: faker.helpers.arrayElement<SkillLevel>(
          Object.values(SkillLevel),
        ),
        type: PoolSkillType.Nonessential,
      };
    }),
  ];
  return {
    id: faker.string.uuid(),
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
    classification: faker.helpers.arrayElement<Classification>(classifications),
    keyTasks: toLocalizedString(faker.lorem.paragraphs()),
    stream: faker.helpers.arrayElement<PoolStream>(Object.values(PoolStream)),
    processNumber: faker.helpers.maybe(() => faker.lorem.word()),
    publishingGroup: faker.helpers.maybe(() =>
      faker.helpers.arrayElement(Object.values(PublishingGroup)),
    ),
    language: faker.helpers.arrayElement(Object.values(PoolLanguage)),
    location: toLocalizedString(faker.location.city()),
    status: faker.helpers.arrayElement(Object.values(PoolStatus)),
    closingDate: faker.date
      .between({ from: FAR_PAST_DATE, to: FAR_FUTURE_DATE })
      .toISOString(),
    publishedAt: faker.date
      .between({ from: FAR_PAST_DATE, to: PAST_DATE })
      .toISOString(),
    essentialSkills,
    nonessentialSkills,
    poolSkills,
    securityClearance: faker.helpers.arrayElement(
      Object.values(SecurityStatus),
    ),
    yourImpact: toLocalizedString(faker.lorem.paragraphs()),
    generalQuestions: faker.helpers.arrayElements<GeneralQuestion>(
      fakeGeneralQuestions(),
    ),
    screeningQuestions: faker.helpers.arrayElements<ScreeningQuestion>(
      fakeScreeningQuestions(),
    ),
    assessmentSteps: [
      fakeAssessmentSteps(1, AssessmentStepType.ApplicationScreening)[0],
      fakeAssessmentSteps(
        1,
        AssessmentStepType.ScreeningQuestionsAtApplication,
      )[0],
      fakeAssessmentSteps(1, AssessmentStepType.InterviewFollowup)[0],
    ],
  };
};

export default (
  numToGenerate = 10,
  skills = fakeSkills(100, fakeSkillFamilies(6)),
  classifications = fakeClassifications(),
  essentialSkillCount = -1,
): Pool[] => {
  const users = fakeUsers();
  faker.seed(0); // repeatable results

  return [...Array(numToGenerate)].map((_, index) => {
    switch (index) {
      case 0:
        return generatePool(
          users,
          skills,
          classifications,
          "CMO",
          "CMO",
          essentialSkillCount,
        );
      case 1:
        return generatePool(
          users,
          skills,
          classifications,

          "IT Apprenticeship Program for Indigenous Peoples",
          "Programme d’apprentissage en TI pour les personnes autochtones",
          essentialSkillCount,
        );
      default:
        return generatePool(
          users,
          skills,
          classifications,
          "",
          "",
          essentialSkillCount,
        );
    }
  });
};
