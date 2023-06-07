import { faker } from "@faker-js/faker";

import {
  ApplicantFilter,
  Department,
  PoolCandidateSearchRequest,
  PoolCandidateSearchStatus,
} from "@gc-digital-talent/graphql";

import fakeApplicantFilters from "./fakeApplicantFilters";
import fakeDepartments from "./fakeDepartments";

const generateSearchRequest = (
  departments: Department[],
  applicantFilters: ApplicantFilter[],
): PoolCandidateSearchRequest => {
  faker.setLocale("en");

  return {
    id: faker.datatype.uuid(),
    fullName: `${faker.name.firstName()} ${faker.name.lastName()}`,
    email: faker.internet.email(),
    department: faker.helpers.arrayElement<Department>(departments),
    jobTitle: faker.name.jobTitle(),
    additionalComments: faker.lorem.sentences(5),
    applicantFilter:
      faker.helpers.arrayElement<ApplicantFilter>(applicantFilters),
    requestedDate: faker.date.between("2000-01-01", "2020-12-31").toISOString(),
    status: faker.helpers.arrayElement<PoolCandidateSearchStatus>(
      Object.values(PoolCandidateSearchStatus),
    ),
    adminNotes: faker.lorem.sentences(5),
  };
};

export default (): PoolCandidateSearchRequest[] => {
  const departments = fakeDepartments();
  const applicantFilters = fakeApplicantFilters();

  faker.seed(0); // repeatable results
  return [...Array(20)].map(() =>
    generateSearchRequest(departments, applicantFilters),
  );
};
