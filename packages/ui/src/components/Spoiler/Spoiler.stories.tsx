import { faker } from "@faker-js/faker/locale/en";

import Spoiler from "./Spoiler";

faker.seed(0);

export default {
  component: Spoiler,
};

export const Default = {
  args: {
    linkSuffix: "of the spoiler",
    text: faker.lorem.sentences(3),
  },
};
