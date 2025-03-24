import { faker } from "@faker-js/faker/locale/en";
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
  PublishingGroup,
  SecurityStatus,
  Skill,
  GeneralQuestion,
  ScreeningQuestion,
  AssessmentStepType,
  PoolSkillType,
  PoolSkill,
  SkillLevel,
  Department,
  PoolOpportunityLength,
  PoolAreaOfSelection,
  PoolSelectionLimitation,
  WorkStream,
} from "@gc-digital-talent/graphql";

import fakeScreeningQuestions from "./fakeScreeningQuestions";
import fakeGeneralQuestions from "./fakeGeneralQuestions";
import fakeUsers from "./fakeUsers";
import fakeClassifications from "./fakeClassifications";
import fakeSkillFamilies from "./fakeSkillFamilies";
import fakeSkills from "./fakeSkills";
import toLocalizedString from "./fakeLocalizedString";
import fakeAssessmentSteps from "./fakeAssessmentSteps";
import fakeDepartments from "./fakeDepartments";
import toLocalizedEnum from "./fakeLocalizedEnum";
import fakeWorkStreams from "./fakeWorkStreams";

const generatePool = (
  users: User[],
  skills: Skill[],
  classifications: Classification[],
  departments: Department[],
  workStreams: WorkStream[],
  englishName = "",
  frenchName = "",
  essentialSkillCount = -1,
  index: number,
): Pool => {
  faker.seed(index); // repeatable results

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
        type: toLocalizedEnum(PoolSkillType.Essential),
      };
    }),
    ...nonessentialSkills.map((skill) => {
      return {
        id: faker.string.uuid(),
        skill,
        requiredLevel: faker.helpers.arrayElement<SkillLevel>(
          Object.values(SkillLevel),
        ),
        type: toLocalizedEnum(PoolSkillType.Nonessential),
      };
    }),
  ];
  const areaOfSelection = toLocalizedEnum(
    faker.helpers.arrayElement(Object.values(PoolAreaOfSelection)),
  );
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
    department: faker.helpers.arrayElement<Department>(departments),
    workStream: faker.helpers.arrayElement<WorkStream>(workStreams),
    keyTasks: toLocalizedString(faker.lorem.paragraphs()),
    processNumber: faker.helpers.maybe(() => faker.lorem.word()),
    publishingGroup: faker.helpers.maybe(() =>
      toLocalizedEnum(
        faker.helpers.arrayElement(Object.values(PublishingGroup)),
      ),
    ),
    language: toLocalizedEnum(
      faker.helpers.arrayElement(Object.values(PoolLanguage)),
    ),
    location: toLocalizedString(faker.location.city()),
    status: toLocalizedEnum(
      faker.helpers.arrayElement(Object.values(PoolStatus)),
    ),
    closingDate: faker.date
      .between({ from: FAR_PAST_DATE, to: FAR_FUTURE_DATE })
      .toISOString(),
    publishedAt: faker.date
      .between({ from: FAR_PAST_DATE, to: PAST_DATE })
      .toISOString(),
    poolSkills,
    securityClearance: toLocalizedEnum(
      faker.helpers.arrayElement(Object.values(SecurityStatus)),
    ),
    opportunityLength: toLocalizedEnum(
      faker.helpers.arrayElement(Object.values(PoolOpportunityLength)),
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
    areaOfSelection: areaOfSelection,
    selectionLimitations:
      areaOfSelection.value == PoolAreaOfSelection.Employees
        ? faker.helpers.arrayElements(
            Object.values(PoolSelectionLimitation).map((l) =>
              toLocalizedEnum(l),
            ),
          )
        : [],
  };
};

export default (
  numToGenerate = 10,
  skills = fakeSkills(100, fakeSkillFamilies(6)),
  classifications = fakeClassifications(),
  departments = fakeDepartments(),
  workStreams = fakeWorkStreams(),
  essentialSkillCount = -1,
): Pool[] => {
  const users = fakeUsers();

  return Array.from({ length: numToGenerate }, (_, index) => {
    switch (index) {
      case 0:
        return generatePool(
          users,
          skills,
          classifications,
          departments,
          workStreams,
          "CMO",
          "CMO",
          essentialSkillCount,
          0,
        );
      case 1:
        return generatePool(
          users,
          skills,
          classifications,
          departments,
          workStreams,
          "IT Apprenticeship Program for Indigenous Peoples",
          "Programme d’apprentissage en TI pour les personnes autochtones",
          essentialSkillCount,
          0,
        );
      default:
        return generatePool(
          users,
          skills,
          classifications,
          departments,
          workStreams,
          "",
          "",
          essentialSkillCount,
          index,
        );
    }
  });
};
