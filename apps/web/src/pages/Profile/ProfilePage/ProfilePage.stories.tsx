import { type Meta, type StoryObj } from "@storybook/react-vite";

import { fakeUsers } from "@gc-digital-talent/fake-data";
import { Container } from "@gc-digital-talent/ui";

import ProfilePage from "./ProfilePage";

const mockUser = fakeUsers(1)[0];

const meta = {
  component: ProfilePage,
  decorators: [
    (Comp) => (
      <Container className="mt-18">
        <Comp />
      </Container>
    ),
  ],
} satisfies Meta<typeof ProfilePage>;

export default meta;

type Story = StoryObj<typeof ProfilePage>;

export const WithData: Story = {
  args: {
    loaderData: {
      user: mockUser,
    },
  },
};

export const Null: Story = {
  args: {
    loaderData: {
      user: {},
    },
  },
};
