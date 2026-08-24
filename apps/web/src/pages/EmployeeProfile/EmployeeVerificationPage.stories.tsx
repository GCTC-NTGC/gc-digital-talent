import type { Meta, StoryObj } from "@storybook/react-vite";

import { experienceGenerators, fakeUsers } from "@gc-digital-talent/fake-data";
import { Container } from "@gc-digital-talent/ui";
import { makeFragmentData } from "@gc-digital-talent/graphql";

import {
  EmployeeVerification,
  EmployeeVerification_Fragment,
} from "./EmployeeVerificationPage";

const mockUser = fakeUsers(1)[0];
const fakeWorkExperience = experienceGenerators.workExperiences()[0];

const meta = {
  component: EmployeeVerification,
  decorators: [
    (Comp) => (
      <Container className="mt-18">
        <Comp />
      </Container>
    ),
  ],
} satisfies Meta<typeof EmployeeVerification>;

export default meta;

type Story = StoryObj<typeof EmployeeVerification>;

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
      EmployeeVerification_Fragment,
    ),
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
      EmployeeVerification_Fragment,
    ),
  },
};
