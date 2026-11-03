import { faker } from "@faker-js/faker/locale/en";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { Container } from "@gc-digital-talent/ui";
import { Language, makeFragmentData } from "@gc-digital-talent/graphql";
import { fakeUsers } from "@gc-digital-talent/fake-data";

import { PersonalInfoBox_Fragment } from "~/components/PersonalInfoBox/PersonalInfoBox";

import {
  AccountSettings,
  PersonalInformation_Fragment,
} from "./AccountSettingsPage";
import { AccountAndContactInformation_Fragment } from "./AccountAndContactInformation";

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
        __typename: "User",
        id: "00000000-0000-0000-0000-000000000000",
        enabledEmailNotifications: user.enabledEmailNotifications ?? null,
        enabledInAppNotifications: user.enabledInAppNotifications ?? null,
        ...makeFragmentData(
          {
            __typename: "User",
            ...makeFragmentData(
              {
                __typename: "User",
                id: "00000000-0000-0000-0000-000000000000",
                firstName: user.firstName ?? null,
                lastName: user.lastName ?? null,
                telephone: user.telephone ?? null,
                email: user.email ?? null,
                preferredLang: {
                  __typename: "LocalizedLanguage",
                  value: Language.En,
                  label: {
                    __typename: "LocalizedString",
                    localized: "English",
                  },
                },
              },
              PersonalInfoBox_Fragment,
            ),
          },
          AccountAndContactInformation_Fragment,
        ),
      },
      PersonalInformation_Fragment,
    ),
  },
};
