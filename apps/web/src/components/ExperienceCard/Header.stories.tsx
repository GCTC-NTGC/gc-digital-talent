import { Meta, StoryObj } from "@storybook/react-vite";
import { faker } from "@faker-js/faker";

import { allModes } from "@gc-digital-talent/storybook-helpers";

import Header from "./Header";

faker.seed(0);

const meta = {
  component: Header,
  parameters: {
    chromatic: {
      modes: {
        light: allModes.light,
        dark: allModes.dark,
      },
    },
  },
} satisfies Meta<typeof Header>;

export default meta;

export const Default: StoryObj<typeof Header> = {
  render: () => (
    <div className="flex flex-col gap-y-6">
      <Header experienceType="award" />
      <Header experienceType="community" />
      <Header experienceType="education" />
      <Header experienceType="personal" />
      <Header experienceType="work" />
    </div>
  ),
};
