import { faker } from "@faker-js/faker";
import pick from "lodash/pick";
import {
  Classification,
  Pool,
  User,
  UserPublicProfile,
} from "../api/generated";
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
