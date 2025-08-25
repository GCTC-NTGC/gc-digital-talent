import { Meta, StoryObj } from "@storybook/react-vite";

import { fakeUser } from "@gc-digital-talent/fake-data";
import {
  makeFragmentData,
  OrganizationTypeInterest,
  TimeFrame,
} from "@gc-digital-talent/graphql";
import { allModes } from "@gc-digital-talent/storybook-helpers";

import {
  DashboardPage as ApplicantDashboardPage,
  ApplicantDashboardPage_Fragment,
} from "./ApplicantDashboardPage";
import {
  CareerDevelopmentTaskCard_Fragment,
  CareerDevelopmentTaskCardOptions_Fragment,
} from "./components/CareerDevelopmentTaskCard";

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
            ...{
              ...mockUser,
              isGovEmployee: true,
              workEmail: "user@domain.tld",
              isVerifiedGovEmployee: true,
              employeeProfile: {
                ...makeFragmentData(
                  {
                    lateralMoveInterest: false,
                    promotionMoveInterest: false,
                  },
                  CareerDevelopmentTaskCard_Fragment,
                ),
              },
            },
          },
          ApplicantDashboardPage_Fragment,
        ),
      },
      ...makeFragmentData(
        {
          organizationTypeInterest: [
            {
              label: {
                en: "Current organization",
                fr: "Current organization fr",
                localized: "Current organization",
              },
              value: OrganizationTypeInterest.Current,
            },
          ],
          timeFrame: [
            {
              label: {
                en: "This year",
                fr: "This year fr",
                localized: "This year",
              },
              value: TimeFrame.ThisYear,
            },
          ],
        },
        CareerDevelopmentTaskCardOptions_Fragment,
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
                ...makeFragmentData(
                  {
                    lateralMoveInterest: false,
                    promotionMoveInterest: false,
                  },
                  CareerDevelopmentTaskCard_Fragment,
                ),
              },
            },
          },
          ApplicantDashboardPage_Fragment,
        ),
      },
      ...makeFragmentData(
        {
          organizationTypeInterest: [
            {
              label: {
                en: "Current organization",
                fr: "Current organization fr",
                localized: "Current organization",
              },
              value: OrganizationTypeInterest.Current,
            },
          ],
          timeFrame: [
            {
              label: {
                en: "This year",
                fr: "This year fr",
                localized: "This year",
              },
              value: TimeFrame.ThisYear,
            },
          ],
        },
        CareerDevelopmentTaskCardOptions_Fragment,
      ),
    },
  },
};
