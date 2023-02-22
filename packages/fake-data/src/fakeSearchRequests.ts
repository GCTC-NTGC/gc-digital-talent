import { faker } from "@faker-js/faker";

import {
  Department,
  PoolCandidateFilter,
  PoolCandidateSearchRequest,
  PoolCandidateSearchStatus,
} from "@gc-digital-talent/graphql";

import fakeDepartments from "./fakeDepartments";
import fakePoolCandidateFilters from "./fakePoolCandidateFilters";

const generateSearchRequest = (
  departments: Department[],
  poolCandidateFilters: PoolCandidateFilter[],
): PoolCandidateSearchRequest => {
  faker.setLocale("en");

  return {
    id: faker.datatype.uuid(),
    fullName: `${faker.name.firstName()} ${faker.name.lastName()}`,
    email: faker.internet.email(),
    department: faker.helpers.arrayElement<Department>(departments),
    jobTitle: faker.name.jobTitle(),
    additionalComments: faker.lorem.sentences(5),
    poolCandidateFilter:
      faker.helpers.arrayElement<PoolCandidateFilter>(poolCandidateFilters),
    requestedDate: faker.date.between("2000-01-01", "2020-12-31").toISOString(),
    status: faker.helpers.arrayElement<PoolCandidateSearchStatus>(
      Object.values(PoolCandidateSearchStatus),
    ),
    adminNotes: faker.lorem.sentences(5),
  };
};

export default (): PoolCandidateSearchRequest[] => {
  const departments = fakeDepartments();
  const poolCandidateFilters = fakePoolCandidateFilters();

  faker.seed(0); // repeatable results
  return [...Array(20)].map(() =>
    generateSearchRequest(departments, poolCandidateFilters),
  );
};
