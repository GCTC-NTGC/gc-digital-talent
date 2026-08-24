import type { Meta, StoryObj } from "@storybook/react-vite";

import { experienceGenerators, fakeUsers } from "@gc-digital-talent/fake-data";
import { Container } from "@gc-digital-talent/ui";
import { makeFragmentData } from "@gc-digital-talent/graphql";

import { CareerPlanning, CareerPlanning_Fragment } from "./CareerPlanningPage";

const mockUser = fakeUsers(1)[0];
const fakeWorkExperience = experienceGenerators.workExperiences()[0];

const meta = {
  component: CareerPlanning,
  decorators: [
    (Comp) => (
      <Container className="mt-18">
        <Comp />
      </Container>
    ),
  ],
} satisfies Meta<typeof CareerPlanning>;

export default meta;

type Story = StoryObj<typeof CareerPlanning>;

export const VerifiedEmployee: Story = {
  args: {
    userQuery: makeFragmentData(
      {
        ...mockUser,
        isVerifiedGovEmployee: true,
        isWorkEmailVerified: true,
        latestCurrentGovernmentWorkExperience: fakeWorkExperience,
        employeeProfile: {},
      },
      CareerPlanning_Fragment,
    ),
    optionsQuery: {},
  },
};

export const UnverifiedUser: Story = {
  args: {
    userQuery: makeFragmentData(
      {
        ...mockUser,
        isVerifiedGovEmployee: false,
        isWorkEmailVerified: false,
        employeeProfile: {},
      },
      CareerPlanning_Fragment,
    ),
    optionsQuery: {},
  },
};
