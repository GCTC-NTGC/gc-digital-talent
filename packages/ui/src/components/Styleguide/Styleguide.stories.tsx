import type { Meta, StoryObj } from "@storybook/react";

import Styleguide from "./Styleguide";

const meta: Meta<typeof Styleguide> = {
  component: Styleguide,
  title: "Components/Styleguide",
};

export default meta;
type Story = StoryObj<typeof Styleguide>;

export const Primary: Story = {
  render: () => (
    <Styleguide>
      <p>Hello</p>
      <br />
    </Styleguide>
  ),
};
