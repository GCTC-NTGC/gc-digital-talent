import { faker } from "@faker-js/faker/locale/en";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { Container } from "@gc-digital-talent/ui";
import { makeFragmentData } from "@gc-digital-talent/graphql";
import { fakeUsers } from "@gc-digital-talent/fake-data";

import {
  AccountSettings,
  PersonalInformation_Fragment,
} from "./AccountSettingsPage";

faker.seed(0);

const user = fakeUsers(1)[0];

const meta = {
  component: AccountSettings,
  decorators: [
    (Comp) => (
      <Container className="mt-18">
        <Comp />
      </Container>
    ),
  ],
} satisfies Meta<typeof AccountSettings>;

export default meta;

type Story = StoryObj<typeof AccountSettings>;

export const Default: Story = {
  args: {
    personalInfoQuery: makeFragmentData(
      {
        id: "00000000-0000-0000-0000-000000000000",
        enabledEmailNotifications: user.enabledEmailNotifications,
        enabledInAppNotifications: user.enabledInAppNotifications,
        firstName: user.firstName,
        lastName: user.lastName,
        telephone: user.telephone,
        email: user.email,
        preferredLang: {
          label: { localized: "English" },
        },
      },
      PersonalInformation_Fragment,
    ),
  },
};
