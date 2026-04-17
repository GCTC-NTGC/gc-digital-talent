import type { Meta, StoryObj } from "@storybook/react-vite";

import { fakeUser } from "@gc-digital-talent/fake-data";
import { makeFragmentData } from "@gc-digital-talent/graphql";
import { allModes } from "@gc-digital-talent/storybook-helpers";

import { CommunityInterestUsersDevelopmentProgramRecords_Fragment } from "~/components/CommunityInterest/CommunityInterest";

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
    applicantDashboardQuery: {
      me: {
        ...makeFragmentData(
          {
            ...mockUser,
            isVerifiedGovEmployee: true,
            employeeProfile: {
              lateralMoveInterest: false,
              promotionMoveInterest: false,
            },
          },
          ApplicantDashboardPage_Fragment,
        ),
      },
    },
    usersDevelopmentProgramRecordsQuery: {
      ...makeFragmentData(
        {
          me: {
            developmentProgramUserRecords: [],
          },
        },
        CommunityInterestUsersDevelopmentProgramRecords_Fragment,
      ),
    },
  },
};

export const NonEmployee: Story = {
  args: {
    applicantDashboardQuery: {
      me: {
        ...makeFragmentData(
          {
            ...{
              ...mockUser,
              isVerifiedGovEmployee: false,
              employeeProfile: {
                lateralMoveInterest: false,
                promotionMoveInterest: false,
              },
            },
          },
          ApplicantDashboardPage_Fragment,
        ),
      },
    },
    usersDevelopmentProgramRecordsQuery: {
      ...makeFragmentData(
        {
          me: {
            developmentProgramUserRecords: [],
          },
        },
        CommunityInterestUsersDevelopmentProgramRecords_Fragment,
      ),
    },
  },
};
