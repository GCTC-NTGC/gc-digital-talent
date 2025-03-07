import type { Meta, StoryObj } from "@storybook/react";
import { faker } from "@faker-js/faker/locale/en";
import { action } from "@storybook/addon-actions";
import { CombinedError } from "urql";

import { MockGraphqlDecorator } from "@gc-digital-talent/storybook-helpers";
import { fakeUsers } from "@gc-digital-talent/fake-data";
import { BasicGovEmployeeProfile } from "@gc-digital-talent/graphql";
import { BasicForm, Submit } from "@gc-digital-talent/forms";

import EmployeeSearchInput, {
  EmployeeSearchInputProps,
} from "./EmployeeSearchInput";

faker.seed(0);

const users = fakeUsers(1);

interface EmployeeSearchInputArgs extends EmployeeSearchInputProps {
  mockSearch?: (term: string) => Promise<BasicGovEmployeeProfile>;
  defaultValue?: string | string[];
}

const meta: Meta<EmployeeSearchInputArgs> = {
  component: EmployeeSearchInput,
  decorators: [MockGraphqlDecorator],
  args: {
    id: "employee",
    name: "employee",
    label: "Employee search",
    wrapperProps: {
      "data-h2-margin": "base(x1 0)",
    },
  },
  parameters: {
    apiResponsesConfig: {
      latency: {
        min: 500,
        max: 2000,
      },
    },
  },
  render: (args) => (
    <BasicForm onSubmit={action("onSubmit")}>
      <EmployeeSearchInput {...args} />
      <Submit />
    </BasicForm>
  ),
};

export default meta;
type Story = StoryObj<typeof EmployeeSearchInput>;

export const Default: Story = {
  parameters: {
    apiResponses: {
      EmployeeSearch: {
        data: {
          govEmployeeProfile: users[0],
        },
      },
    },
  },
};

export const NoResult: Story = {
  parameters: {
    apiResponses: {
      EmployeeSearch: {
        data: {
          govEmployeeProfile: null,
        },
      },
    },
  },
};

export const NotGovernmentEmail: Story = {
  parameters: {
    apiResponses: {
      EmployeeSearch: {
        data: {
          govEmployeeProfile: null,
        },
        error: new CombinedError({
          graphQLErrors: [
            {
              message: "Validation failed for the field [govEmployeeProfile].",
              extensions: {
                validation: {
                  workEmail: ["NotGovernmentEmail"],
                },
              },
            },
          ],
        }),
      },
    },
  },
};
