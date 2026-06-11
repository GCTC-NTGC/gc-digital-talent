import type { Meta, StoryObj } from "@storybook/react-vite";

import { fakeExperiences } from "@gc-digital-talent/fake-data";
import { Container } from "@gc-digital-talent/ui";
import { makeFragmentData } from "@gc-digital-talent/graphql";

import { CareerTimelineSectionExperience_Fragment } from "~/components/CareerTimelineSection/CareerTimelineSection";

import { CareerTimeline } from "./CareerTimelinePage";

const mockExperiences = fakeExperiences(10);

const meta = {
  component: CareerTimeline,
  decorators: [
    (Comp) => (
      <Container className="mt-18">
        <Comp />
      </Container>
    ),
  ],
  args: {
    userId: "test",
    experiencesQuery: [],
  },
} satisfies Meta<typeof CareerTimeline>;

export default meta;

type Story = StoryObj<typeof CareerTimeline>;

export const WithExperiences: Story = {
  args: {
    experiencesQuery: mockExperiences.map((experience) =>
      makeFragmentData(experience, CareerTimelineSectionExperience_Fragment),
    ),
  },
};

export const NoExperiences: Story = {
  args: {
    experiencesQuery: [],
  },
};
