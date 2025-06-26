import type { Meta, StoryObj } from "@storybook/react-vite";

import InclusivityEquityPage from "./InclusivityEquityPage";

const meta = {
  component: InclusivityEquityPage,
} satisfies Meta<typeof InclusivityEquityPage>;

export default meta;

type Story = StoryObj<typeof InclusivityEquityPage>;

export const Default: Story = {};
