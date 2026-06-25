import { faker } from "@faker-js/faker/locale/en";

import {
  TalentRequestCompletionDetail,
  TalentRequestInProgressDetail,
  TalentRequestPositionType,
  TalentRequestReason,
  TalentRequestStatus,
  type ApplicantFilter,
  type Department,
  type TalentRequest,
} from "@gc-digital-talent/graphql";

import fakeApplicantFilters from "./fakeApplicantFilters";
import fakeDepartments from "./fakeDepartments";
import toLocalizedEnum from "./fakeLocalizedEnum";

const generateTalentRequest = (
  departments: Department[],
  applicantFilters: ApplicantFilter[],
): TalentRequest => {
  const status = toLocalizedEnum(
    faker.helpers.arrayElement<TalentRequestStatus>(
      Object.values(TalentRequestStatus),
    ),
  );
  let details = null;
  if (status.value === TalentRequestStatus.InProgress) {
    details = toLocalizedEnum(
      faker.helpers.arrayElement<TalentRequestInProgressDetail>(
        Object.values(TalentRequestInProgressDetail),
      ),
    ).label;
  }
  if (status.value === TalentRequestStatus.Completed) {
    details = toLocalizedEnum(
      faker.helpers.arrayElement<TalentRequestCompletionDetail>(
        Object.values(TalentRequestCompletionDetail),
      ),
    ).label;
  }

  return {
    id: faker.string.uuid(),
    fullName: `${faker.person.firstName()} ${faker.person.lastName()}`,
    email: faker.internet.email(),
    department: faker.helpers.arrayElement<Department>(departments),
    jobTitle: faker.person.jobTitle(),
    managerJobTitle: faker.person.jobTitle(),
    positionType: toLocalizedEnum(
      faker.helpers.arrayElement<TalentRequestPositionType>(
        Object.values(TalentRequestPositionType),
      ),
    ),
    reason: toLocalizedEnum(
      faker.helpers.arrayElement<TalentRequestReason>(
        Object.values(TalentRequestReason),
      ),
    ),
    additionalComments: faker.lorem.sentences(5),
    hrAdvisorEmail: faker.internet.email(),
    applicantFilter:
      faker.helpers.arrayElement<ApplicantFilter>(applicantFilters),
    requestedDate: faker.date
      .between({ from: "2000-01-01", to: "2020-12-31" })
      .toISOString(),
    talentRequestStatus: status,
    details,
    adminNotes: faker.lorem.sentences(5),
  };
};

export default (): TalentRequest[] => {
  const departments = fakeDepartments();
  const applicantFilters = fakeApplicantFilters();

  faker.seed(0); // repeatable results
  return Array.from({ length: 20 }, () =>
    generateTalentRequest(departments, applicantFilters),
  );
};
