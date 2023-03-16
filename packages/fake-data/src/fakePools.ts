import { faker } from "@faker-js/faker";
import pick from "lodash/pick";

import {
  Classification,
  Pool,
  User,
  UserPublicProfile,
  PoolStatus,
  PoolStream,
  PublishingGroup,
} from "@gc-digital-talent/graphql";

import fakeUsers from "./fakeUsers";
import fakeClassifications from "./fakeClassifications";

const generatePool = (
  englishName: string,
  frenchName: string,
  users: User[],
  classifications: Classification[],
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
      en: englishName,
      fr: frenchName,
    },
    description: {
      en: `EN ${faker.lorem.sentence()}`,
      fr: `FR ${faker.lorem.sentence()}`,
    },
    classifications:
      faker.helpers.arrayElements<Classification>(classifications),
    keyTasks: {
      en: `EN ${faker.lorem.paragraph()}`,
      fr: `FR ${faker.lorem.paragraph()}`,
    },
    status: faker.helpers.arrayElement<PoolStatus>(Object.values(PoolStatus)),
    stream: faker.helpers.arrayElement<PoolStream>(Object.values(PoolStream)),
    processNumber: faker.helpers.maybe(() => faker.lorem.word()),
    publishingGroup: faker.helpers.maybe(() =>
      faker.helpers.arrayElement(Object.values(PublishingGroup)),
    ),
  };
};

export default (): Pool[] => {
  const users = fakeUsers();
  const classifications = fakeClassifications();
  faker.seed(0); // repeatable results
  faker.setLocale("en");

  return [
    generatePool("CMO", "CMO", users, classifications),
    generatePool(
      "Indigenous Apprenticeship Program",
      "Indigenous Apprenticeship Program FR",
      users,
      classifications,
    ),
  ];
};
