import { faker } from "@faker-js/faker/locale/en";

import {
  FAR_FUTURE_DATE,
  FAR_PAST_DATE,
  PAST_DATE,
} from "@gc-digital-talent/date-helpers";
import type {
  GeneralQuestion,
  ScreeningQuestion,
} from "@gc-digital-talent/graphql/schema-types";
import {
  PoolStatus,
  PoolLanguage,
  PublishingGroup,
  SecurityStatus,
  AssessmentStepType,
  PoolSkillType,
  SkillLevel,
  PoolOpportunityLength,
  PoolAreaOfSelection,
  PoolSelectionLimitation,
} from "@gc-digital-talent/graphql/schema-types";

import fakePaginatorInfo, { fakePaginateData } from "./fakePaginatorInfo";
import fakeScreeningQuestions from "./fakeScreeningQuestions";
import fakeGeneralQuestions from "./fakeGeneralQuestions";
import fakeClassifications from "./fakeClassifications";
import fakeCommunities from "./fakeCommunities";
import fakeSkillFamilies from "./fakeSkillFamilies";
import fakeSkills from "./fakeSkills";
import toLocalizedString from "./fakeLocalizedString";
import fakeAssessmentSteps from "./fakeAssessmentSteps";
import fakeDepartments from "./fakeDepartments";
import toLocalizedEnum from "./fakeLocalizedEnum";
import fakeWorkStreams from "./fakeWorkStreams";

const generatePool = (
  skills: ReturnType<typeof fakeSkills>,
  classifications: ReturnType<typeof fakeClassifications>,
  departments: ReturnType<typeof fakeDepartments>,
  workStreams: ReturnType<typeof fakeWorkStreams>,
  englishName = "",
  frenchName = "",
  essentialSkillCount = -1,
  index: number,
) => {
  faker.seed(index); // repeatable results

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
  const poolSkills = [
    ...essentialSkills.map((skill) => {
      return {
        __typename: "PoolSkill" as const,
        id: faker.string.uuid(),
        skill,
        requiredLevel: faker.helpers.arrayElement<SkillLevel>(
          Object.values(SkillLevel),
        ),
        type: toLocalizedEnum(
          PoolSkillType.Essential,
          "LocalizedPoolSkillType",
        ),
      };
    }),
    ...nonessentialSkills.map((skill) => {
      return {
        __typename: "PoolSkill" as const,
        id: faker.string.uuid(),
        skill,
        requiredLevel: faker.helpers.arrayElement<SkillLevel>(
          Object.values(SkillLevel),
        ),
        type: toLocalizedEnum(
          PoolSkillType.Nonessential,
          "LocalizedPoolSkillType",
        ),
      };
    }),
  ];
  const areaOfSelection = toLocalizedEnum(
    faker.helpers.arrayElement(Object.values(PoolAreaOfSelection)),
    "LocalizedPoolAreaOfSelection",
  );
  return {
    __typename: "Pool" as const,
    id: faker.string.uuid(),
    name: {
      __typename: "LocalizedString" as const,
      en: englishName || `${faker.company.catchPhrase()} EN`,
      fr: frenchName || `${faker.company.catchPhrase()} FR`,
      localized: englishName || `${faker.company.catchPhrase()} LOCALIZED`,
    },
    teamId: faker.string.uuid(),
    classification: faker.helpers.arrayElement(classifications),
    department: faker.helpers.arrayElement(departments),
    workStream: faker.helpers.arrayElement(workStreams),
    community: faker.helpers.arrayElement(fakeCommunities(1)),
    keyTasks: toLocalizedString(faker.lorem.paragraphs()),
    processNumber: faker.helpers.maybe(() => faker.lorem.word()) ?? null,
    publishingGroup:
      faker.helpers.maybe(() =>
        toLocalizedEnum(
          faker.helpers.arrayElement(Object.values(PublishingGroup)),
          "LocalizedPublishingGroup",
        ),
      ) ?? null,
    language: toLocalizedEnum(
      faker.helpers.arrayElement(Object.values(PoolLanguage)),
      "LocalizedPoolLanguage",
    ),
    location: toLocalizedString(faker.location.city()),
    status: toLocalizedEnum(
      faker.helpers.arrayElement(Object.values(PoolStatus)),
      "LocalizedPoolStatus",
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
      "LocalizedSecurityStatus",
    ),
    opportunityLength: toLocalizedEnum(
      faker.helpers.arrayElement(Object.values(PoolOpportunityLength)),
      "LocalizedPoolOpportunityLength",
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
              toLocalizedEnum(l, "LocalizedPoolSelectionLimitation"),
            ),
          )
        : [],
    activities: {
      __typename: "ActivityPaginator" as const,
      paginatorInfo: fakePaginatorInfo(0),
      data: fakePaginateData([], fakePaginatorInfo(0)),
    },
    applicantsCount: faker.number.int({ max: 99999 }),
    poolCandidatesCount: faker.number.int({ max: 99999 }),
    wasClosedEarly: false,
    isRemote: faker.datatype.boolean(),
    isComplete: faker.datatype.boolean(),
    closingReason: faker.lorem.sentence(),
    contactEmail: faker.internet.email(),
    aboutUs: toLocalizedString(faker.lorem.paragraphs()),
    specialNote: toLocalizedString(faker.lorem.paragraphs()),
    whatToExpect: toLocalizedString(faker.lorem.paragraphs()),
    whatToExpectAdmission: toLocalizedString(faker.lorem.paragraphs()),
  };
};

export default (
  numToGenerate = 10,
  skills = fakeSkills(100, fakeSkillFamilies(6)),
  classifications = fakeClassifications(),
  departments = fakeDepartments(),
  workStreams = fakeWorkStreams(),
  essentialSkillCount = -1,
) => {
  return Array.from({ length: numToGenerate }, (_, index) => {
    switch (index) {
      case 0:
        return generatePool(
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
          skills,
          classifications,
          departments,
          workStreams,
          "IT Apprenticeship Program for Indigenous Peoples",
          "Programme d’apprentissage en TI pour les personnes autochtones",
          essentialSkillCount,
          1,
        );
      default:
        return generatePool(
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
