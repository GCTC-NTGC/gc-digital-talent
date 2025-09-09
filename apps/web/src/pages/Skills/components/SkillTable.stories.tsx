import { Meta, StoryObj } from "@storybook/react-vite";

import { fakeSkillFamilies, fakeSkills } from "@gc-digital-talent/fake-data";
import { MockGraphqlDecorator } from "@gc-digital-talent/storybook-helpers";

import SkillTable from "./SkillTable";

const mockSkills = fakeSkills();
const mockSkillFamilies = fakeSkillFamilies();

export default {
  component: SkillTable,
  args: {
    title: "Skills",
  },
  decorators: [MockGraphqlDecorator],
  parameters: {
    apiResponses: {
      SkillTableSkills: {
        data: {
          skills: mockSkills,
          skillFamilies: mockSkillFamilies,
        },
      },
    },
  },
} satisfies Meta<typeof SkillTable>;

type Story = StoryObj<typeof SkillTable>;

export const Default: Story = {};
