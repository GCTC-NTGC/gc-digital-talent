import type { Meta, StoryObj } from "@storybook/react-vite";

import { experienceGenerators, fakeUsers } from "@gc-digital-talent/fake-data";
import { Container } from "@gc-digital-talent/ui";
import { makeFragmentData } from "@gc-digital-talent/graphql";

import {
  EmployeeProfile,
  EmployeeProfile_Fragment,
} from "./EmployeeProfilePage";

const mockUser = fakeUsers(1)[0];
const fakeWorkExperience = experienceGenerators.workExperiences()[0];

const meta = {
  component: EmployeeProfile,
  decorators: [
    (Comp) => (
      <Container className="mt-18">
        <Comp />
      </Container>
    ),
  ],
} satisfies Meta<typeof EmployeeProfile>;

export default meta;

type Story = StoryObj<typeof EmployeeProfile>;

export const VerifiedEmployee: Story = {
  args: {
    employeeProfileQuery: makeFragmentData(
      {
        ...mockUser,
        isVerifiedGovEmployee: true,
        isWorkEmailVerified: true,
        latestCurrentGovernmentWorkExperience: fakeWorkExperience,
        employeeProfile: {},
      },
      EmployeeProfile_Fragment,
    ),
    optionsQuery: {},
  },
};

export const UnverifiedUser: Story = {
  args: {
    employeeProfileQuery: makeFragmentData(
      {
        ...mockUser,
        isVerifiedGovEmployee: false,
        isWorkEmailVerified: false,
        employeeProfile: {},
      },
      EmployeeProfile_Fragment,
    ),
    optionsQuery: {},
  },
};
