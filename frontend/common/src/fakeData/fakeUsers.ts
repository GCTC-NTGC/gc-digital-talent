import faker from "faker";
import { User, Language } from "../api/generated";

const generateUser = (): User => {
  faker.setLocale("en");

  return {
    id: faker.datatype.uuid(),
    email: faker.internet.email(),
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    telephone: faker.helpers.replaceSymbols("+###########"),
    preferredLang: faker.random.arrayElement(Object.values(Language)),
  };
};

export default (): User[] => {
  faker.seed(0); // repeatable results
  return [...Array(100)].map(() => generateUser());
};
