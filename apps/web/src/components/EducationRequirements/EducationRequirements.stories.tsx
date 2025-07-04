import { Meta, StoryObj } from "@storybook/react-vite";

import EducationRequirements from "./EducationRequirements";

const meta = {
  component: EducationRequirements,
  args: {
    isIAP: false,
  },
} satisfies Meta<typeof EducationRequirements>;

export default meta;

export const Default: StoryObj<typeof EducationRequirements> = {
  render: (args) => (
    <div className="flex max-w-3/4 flex-col gap-y-6">
      <EducationRequirements {...args} classificationGroup="AS" />
      <EducationRequirements {...args} classificationGroup="CR" />
      <EducationRequirements {...args} classificationGroup="EC" />
      <EducationRequirements {...args} classificationGroup="EX" />
      <EducationRequirements {...args} classificationGroup="IT" />
      <EducationRequirements {...args} classificationGroup="PM" />
    </div>
  ),
};
