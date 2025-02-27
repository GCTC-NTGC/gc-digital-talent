import { Meta, StoryObj } from "@storybook/react";

import { fakeUser } from "@gc-digital-talent/fake-data";
import { makeFragmentData } from "@gc-digital-talent/graphql";
import { allModes } from "@gc-digital-talent/storybook-helpers";

import {
  DashboardPage as ApplicantDashboardPage,
  ApplicantDashboardPage_Fragment,
} from "./ApplicantDashboardPage";

const mockUser = fakeUser();

const meta: Meta<typeof ApplicantDashboardPage> = {
  component: ApplicantDashboardPage,
  parameters: {
    chromatic: {
      modes: {
        light: allModes.light,
        "light mobile": allModes["light mobile"],
        dark: allModes.dark,
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof ApplicantDashboardPage>;

export const VerifiedGovernmentEmployee: Story = {
  args: {
    applicantDashboardQuery: makeFragmentData(
      {
        ...{
          ...mockUser,
          isVerifiedGovEmployee: true,
          employeeProfile: {},
        },
      },
      ApplicantDashboardPage_Fragment,
    ),
  },
};

export const NonEmployee: Story = {
  args: {
    applicantDashboardQuery: makeFragmentData(
      {
        ...{
          ...mockUser,
          isVerifiedGovEmployee: false,
          employeeProfile: {},
        },
      },
      ApplicantDashboardPage_Fragment,
    ),
  },
};
