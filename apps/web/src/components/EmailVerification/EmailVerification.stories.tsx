import { StoryFn } from "@storybook/react";
import { faker } from "@faker-js/faker/locale/en";

import {
  experienceGenerators,
  getStaticSkills,
} from "@gc-digital-talent/fake-data";

import EmailVerification from "./EmailVerification";

faker.seed(0);

export default {
  component: EmailVerification,
};

const Template: StoryFn<typeof EmailVerification> = (args) => {
  return <EmailVerification {...args} />;
};

export const ContactEmail = Template.bind({});
ContactEmail.args = {
  emailAddress: "example@example.org",
};
