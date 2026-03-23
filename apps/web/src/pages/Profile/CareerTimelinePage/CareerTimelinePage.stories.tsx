import { Meta, StoryObj } from "@storybook/react-vite";

import { fakeExperiences } from "@gc-digital-talent/fake-data";
import { Container } from "@gc-digital-talent/ui";

const mockExperiences = fakeExperiences(10);

import CareerTimelinePage from "./CareerTimelinePage";

const meta = {
  component: CareerTimelinePage,
  decorators: [
    (Comp) => (
      <Container className="mt-18">
        <Comp />
      </Container>
    ),
  ],
} satisfies Meta<typeof CareerTimelinePage>;

export default meta;

type Story = StoryObj<typeof CareerTimelinePage>;

export const WithExperiences: Story = {
  args: {
    loaderData: {
      user: {
        id: "test-user",
        experiences: mockExperiences,
      },
    },
  },
};

export const NoExperiences: Story = {
  args: {
    loaderData: {
      user: {
        id: "test-user",
        experiences: [],
      },
    },
  },
};
