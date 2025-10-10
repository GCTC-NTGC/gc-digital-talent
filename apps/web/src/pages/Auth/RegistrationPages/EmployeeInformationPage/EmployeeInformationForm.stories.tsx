import { Meta, StoryFn } from "@storybook/react-vite";
import { action } from "storybook/actions";

import { MockGraphqlDecorator } from "@gc-digital-talent/storybook-helpers";
import { EmploymentCategory } from "@gc-digital-talent/graphql";

import { EmployeeInformationForm } from "./EmployeeInformationPage";

export const employmentCategoriesApiResponse = {
  data: {
    employmentCategoryTypes: [
      {
        value: EmploymentCategory.ExternalOrganization,
        label: {
          en: "External organization",
          fr: "Organisation externe",
        },
        __typename: "LocalizedEmploymentCategory",
      },
      {
        value: EmploymentCategory.GovernmentOfCanada,
        label: {
          en: "Government of Canada",
          fr: "Gouvernement du Canada",
        },
        __typename: "LocalizedEmploymentCategory",
      },
      {
        value: EmploymentCategory.CanadianArmedForces,
        label: {
          en: "Canadian Armed Forces",
          fr: "Forces arm\u00e9es canadiennes",
        },
        __typename: "LocalizedEmploymentCategory",
      },
    ],
  },
} as const;

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
    apiResponses: {
      WorkFieldOptions: employmentCategoriesApiResponse,
    },
  },
} as Meta<typeof EmployeeInformationForm>;

const Template: StoryFn<typeof EmployeeInformationForm> = () => {
  return (
    <EmployeeInformationForm
      navigationTarget="#"
      // Note: Needed for function colouring
      // eslint-disable-next-line @typescript-eslint/require-await
      onSubmit={async (data) => {
        action("submit")(data);
      }}
    />
  );
};

export const Default = Template.bind({});
