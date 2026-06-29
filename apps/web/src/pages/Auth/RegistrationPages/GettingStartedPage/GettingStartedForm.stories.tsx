import type { Meta, StoryFn } from "@storybook/react-vite";

import { makeFragmentData } from "@gc-digital-talent/graphql";

import GettingStartedForm, {
  GettingStartedInitialValues_Query,
} from "./GettingStartedForm";

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
      firstName: "First",
      lastName: "Last",
      preferredLang: {
        label: {
          localized: "Language",
        },
      },
      email: "example@example.org",
      workEmail: null,
      isWorkEmailVerified: null,
      telephone: "1234567890",
    },
    GettingStartedInitialValues_Query,
  );

  return <GettingStartedForm initialValuesQuery={mockData} />;
};

export const NonEmployee = NonEmployeeTemplate.bind({});

const EmployeeTemplate: StoryFn<typeof GettingStartedForm> = () => {
  const mockData = makeFragmentData(
    {
      firstName: "First",
      lastName: "Last",
      preferredLang: {
        label: {
          localized: "Language",
        },
      },
      email: "example@gc.ca",
      workEmail: "example@gc.ca",
      isWorkEmailVerified: true,
      telephone: "1234567890",
    },
    GettingStartedInitialValues_Query,
  );

  return <GettingStartedForm initialValuesQuery={mockData} />;
};

export const Employee = EmployeeTemplate.bind({});
