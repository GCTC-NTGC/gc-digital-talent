import { Meta, StoryFn } from "@storybook/react";

import { fakeUser } from "@gc-digital-talent/fake-data";
import { makeFragmentData } from "@gc-digital-talent/graphql";
import { allModes } from "@gc-digital-talent/storybook-helpers";

import {
  DashboardPage as ApplicantDashboardPage,
  ApplicantDashboardPage_Fragment,
} from "./ApplicantDashboardPage";

const mockUser = fakeUser();

export default {
  component: ApplicantDashboardPage,
} as Meta<typeof ApplicantDashboardPage>;

const Template: StoryFn<typeof ApplicantDashboardPage> = (args) => (
  <ApplicantDashboardPage {...args} />
);

export const Default = Template.bind({});
Default.args = {
  applicantDashboardQuery: makeFragmentData(
    {
      ...{
        ...mockUser,
        isGovEmployee: true,
        workEmail: "user@domain.tld",
        isWorkEmailVerified: true,
        employeeProfile: {},
      },
    },
    ApplicantDashboardPage_Fragment,
  ),
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
