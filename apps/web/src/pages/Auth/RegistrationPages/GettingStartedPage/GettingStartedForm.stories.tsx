import type { Meta, StoryFn } from "@storybook/react-vite";

import { fakeUsers, toLocalizedEnum } from "@gc-digital-talent/fake-data";
import { Language, makeFragmentData } from "@gc-digital-talent/graphql";

import { PersonalInfoBox_Fragment } from "~/components/PersonalInfoBox/PersonalInfoBox";

import GettingStartedForm, {
  GettingStartedInitialValues_Query,
} from "./GettingStartedForm";

const [user] = fakeUsers(1);

const mockPersonalInfo = (email: string) =>
  makeFragmentData(
    {
      __typename: "User",
      id: user.id,
      firstName: user.firstName ?? null,
      lastName: user.lastName ?? null,
      telephone: user.telephone ?? null,
      email,
      preferredLang: toLocalizedEnum(Language.En, "LocalizedLanguage"),
    },
    PersonalInfoBox_Fragment,
  );

export default {
  component: GettingStartedForm,
  parameters: {
    apiResponses: {
      SendUserEmailsVerification: {
        data: {
          sendUserEmailsVerification: {
            id: 1,
          },
        },
      },
    },
  },
} as Meta<typeof GettingStartedForm>;

const NonEmployeeTemplate: StoryFn<typeof GettingStartedForm> = () => {
  const mockData = makeFragmentData(
    {
      __typename: "User",
      workEmail: null,
      isWorkEmailVerified: null,
      ...mockPersonalInfo("example@example.org"),
    },
    GettingStartedInitialValues_Query,
  );

  return <GettingStartedForm initialValuesQuery={mockData} />;
};

export const NonEmployee = NonEmployeeTemplate.bind({});

const EmployeeTemplate: StoryFn<typeof GettingStartedForm> = () => {
  const mockData = makeFragmentData(
    {
      __typename: "User",
      workEmail: "example@gc.ca",
      isWorkEmailVerified: true,
      ...mockPersonalInfo("example@gc.ca"),
    },
    GettingStartedInitialValues_Query,
  );

  return <GettingStartedForm initialValuesQuery={mockData} />;
};

export const Employee = EmployeeTemplate.bind({});
