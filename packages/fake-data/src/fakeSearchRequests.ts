import { faker } from "@faker-js/faker/locale/en";

import {
  ApplicantFilter,
  Department,
  PoolCandidateSearchPositionType,
  PoolCandidateSearchRequestReason,
  PoolCandidateSearchRequest,
  PoolCandidateSearchStatus,
} from "@gc-digital-talent/graphql";

import fakeApplicantFilters from "./fakeApplicantFilters";
import fakeDepartments from "./fakeDepartments";
import toLocalizedEnum from "./fakeLocalizedEnum";

const generateSearchRequest = (
  departments: Department[],
  applicantFilters: ApplicantFilter[],
): PoolCandidateSearchRequest => {
  return {
    id: faker.string.uuid(),
    fullName: `${faker.person.firstName()} ${faker.person.lastName()}`,
    email: faker.internet.email(),
    department: faker.helpers.arrayElement<Department>(departments),
    jobTitle: faker.person.jobTitle(),
    managerJobTitle: faker.person.jobTitle(),
    positionType: toLocalizedEnum(
      faker.helpers.arrayElement<PoolCandidateSearchPositionType>(
        Object.values(PoolCandidateSearchPositionType),
      ),
    ),
    reason: toLocalizedEnum(
      faker.helpers.arrayElement<PoolCandidateSearchRequestReason>(
        Object.values(PoolCandidateSearchRequestReason),
      ),
    ),
    additionalComments: faker.lorem.sentences(5),
    hrAdvisorEmail: faker.internet.email(),
    applicantFilter:
      faker.helpers.arrayElement<ApplicantFilter>(applicantFilters),
    requestedDate: faker.date
      .between({ from: "2000-01-01", to: "2020-12-31" })
      .toISOString(),
    status: toLocalizedEnum(
      faker.helpers.arrayElement<PoolCandidateSearchStatus>(
        Object.values(PoolCandidateSearchStatus),
      ),
    ),
    adminNotes: faker.lorem.sentences(5),
  };
};

export default (): PoolCandidateSearchRequest[] => {
  const departments = fakeDepartments();
  const applicantFilters = fakeApplicantFilters();

  faker.seed(0); // repeatable results
  return Array.from({ length: 20 }, () =>
    generateSearchRequest(departments, applicantFilters),
  );
};
