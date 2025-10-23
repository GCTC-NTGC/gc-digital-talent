import { Meta, StoryFn } from "@storybook/react-vite";
import { action } from "storybook/actions";
import { userEvent, screen } from "storybook/test";

import { fakeLocalizedEnum } from "@gc-digital-talent/fake-data";
import { Language, makeFragmentData } from "@gc-digital-talent/graphql";

import EmailVerification from "~/components/EmailVerification/EmailVerification";

import {
  GettingStartedForm,
  GettingStartedInitialValues_Query,
  GettingStartedOptions_Query,
} from "./GettingStartedForm";

const mockInitialValuesData = makeFragmentData(
  {
    email: "example@example.org",
  },
  GettingStartedInitialValues_Query,
);

const mockOptionsData = makeFragmentData(
  {
    languages: fakeLocalizedEnum(Language),
  },
  GettingStartedOptions_Query,
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

const Template: StoryFn<typeof GettingStartedForm> = () => {
  return (
    <EmailVerification.Provider>
      <GettingStartedForm
        initialValuesQuery={mockInitialValuesData}
        optionsQuery={mockOptionsData}
        // NOTE: Needed for function colouring
        // eslint-disable-next-line @typescript-eslint/require-await
        onSubmit={async (data) => {
          action("submit")(data);
        }}
      />
    </EmailVerification.Provider>
  );
};

export const Default = Template.bind({});

export const CodeRequested = Template.bind({});
CodeRequested.play = async () => {
  const submitBtn = screen.getByRole("button", { name: /send/i });
  await userEvent.click(submitBtn);
};
