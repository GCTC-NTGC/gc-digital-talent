import { Meta, StoryObj } from "@storybook/react-vite";
import CurrencyDollarIcon from "@heroicons/react/24/outline/CurrencyDollarIcon";
import { faker } from "@faker-js/faker";

import { allModes } from "@gc-digital-talent/storybook-helpers";

import IconLabel from "./IconLabel";

faker.seed(0);

const meta = {
  component: IconLabel,
  parameters: {
    chromatic: {
      modes: {
        light: allModes.light,
        dark: allModes.dark,
      },
    },
  },
} satisfies Meta<typeof IconLabel>;

export default meta;

export const Default: StoryObj<typeof IconLabel> = {
  render: () => (
    <div className="flex flex-col gap-y-6">
      <IconLabel label="Icon label" icon={CurrencyDollarIcon} />
    </div>
  ),
};
