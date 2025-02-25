import { Meta, StoryFn } from "@storybook/react";

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

export default {
  component: ApplicantDashboardPage,
} as Meta<typeof ApplicantDashboardPage>;

const Template: StoryFn<typeof ApplicantDashboardPage> = (args) => (
  <ApplicantDashboardPage {...args} />
);

export const Default = Template.bind({});
Default.args = {
  applicantDashboardQuery: {
    me: {
      ...makeFragmentData(
        {
          ...{
            ...mockUser,
            isGovEmployee: true,
            workEmail: "user@domain.tld",
            isWorkEmailVerified: true,
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
};
Default.parameters = {
  chromatic: {
    modes: {
      light: allModes.light,
      "light mobile": allModes["light mobile"],
      dark: allModes.dark,
    },
  },
};
