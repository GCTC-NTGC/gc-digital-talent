import type { Meta, StoryObj } from "@storybook/react-vite";

import { fakeExperiences } from "@gc-digital-talent/fake-data";
import { Container } from "@gc-digital-talent/ui";
import { makeFragmentData } from "@gc-digital-talent/graphql";

import { ExperienceListCard_Fragment } from "~/components/ExperienceListCard/ExperienceListCard";

import { CareerExperience } from "./CareerExperiencePage";

const mockExperiences = fakeExperiences(10);

const meta = {
  component: CareerExperience,
  decorators: [
    (Comp) => (
      <Container className="mt-18">
        <Comp />
      </Container>
    ),
  ],
  args: {
    experiencesQuery: [],
  },
} satisfies Meta<typeof CareerExperience>;

export default meta;

type Story = StoryObj<typeof CareerExperience>;

export const WithExperiences: Story = {
  args: {
    experiencesQuery: mockExperiences.map((experience) =>
      makeFragmentData(experience, ExperienceListCard_Fragment),
    ),
  },
};

export const NoExperiences: Story = {
  args: {
    experiencesQuery: [],
  },
};
