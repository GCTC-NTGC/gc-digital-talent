import type { Meta, StoryFn } from "@storybook/react-vite";
import { action } from "storybook/actions";

import { MockGraphqlDecorator } from "@gc-digital-talent/storybook-helpers";

import { EmployeeInformationForm } from "./EmployeeInformationPage";
import { getFakeWorkFieldOptionsResponse } from "./testUtils";

export default {
  component: EmployeeInformationForm,
  decorators: [MockGraphqlDecorator],
  parameters: {
    apiResponsesConfig: {
      latency: {
        min: 0,
        max: 0,
      },
    },
    apiResponses: getFakeWorkFieldOptionsResponse(),
  },
} as Meta<typeof EmployeeInformationForm>;

const Template: StoryFn<typeof EmployeeInformationForm> = () => {
  return (
    <EmployeeInformationForm
      navigationTarget="#"
      // Note: Needed for function colouring
      // oxlint-disable-next-line typescript/require-await
      onSubmit={async (data) => {
        action("submit")(data);
      }}
    />
  );
};

export const Default = Template.bind({});
