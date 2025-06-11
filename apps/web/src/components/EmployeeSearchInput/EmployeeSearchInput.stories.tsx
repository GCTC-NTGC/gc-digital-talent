import type { Meta, StoryObj } from "@storybook/react-vite";
import { faker } from "@faker-js/faker/locale/en";
import { action } from "storybook/actions";
import { within, userEvent } from "storybook/test";
import { CombinedError } from "urql";

import { MockGraphqlDecorator } from "@gc-digital-talent/storybook-helpers";
import { fakeUsers } from "@gc-digital-talent/fake-data";
import { BasicForm, Submit } from "@gc-digital-talent/forms";
import { makeFragmentData } from "@gc-digital-talent/graphql";

import EmployeeSearchInput, {
  EmployeeSearchInputProps,
} from "./EmployeeSearchInput";
import { EmployeeSearchResult_Fragment, fragmentToEmployee } from "./utils";
faker.seed(0);

const users = fakeUsers(1);

interface EmployeeSearchInputArgs extends EmployeeSearchInputProps {
  defaultValue?: string;
}

const meta: Meta<EmployeeSearchInputArgs> = {
  component: EmployeeSearchInput,
  decorators: [MockGraphqlDecorator],
  args: {
    id: "employee",
    name: "employee",
    label: "Employee search",
    wrapperProps: {
      className: "my-6",
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
  render: ({ defaultValue, ...args }) => (
    <BasicForm
      onSubmit={action("onSubmit")}
      options={
        defaultValue
          ? { defaultValues: { [args.name]: defaultValue } }
          : undefined
      }
    >
      <EmployeeSearchInput {...args} />
      <Submit />
    </BasicForm>
  ),
};

export default meta;
type Story = StoryObj<EmployeeSearchInputArgs>;

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

export const Required: Story = {
  args: {
    rules: { required: "This field is required" },
  },
  parameters: {
    apiResponses: {
      EmployeeSearch: {
        data: {
          govEmployeeProfile: null,
        },
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const submitBtn = canvas.getByRole("button", { name: /submit/i });
    await userEvent.click(submitBtn);
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

export const WithDefaultValue: Story = {
  args: {
    defaultValue: users[0].id,
    employeeOption: fragmentToEmployee(
      makeFragmentData(
        { ...users[0], __typename: "BasicGovEmployeeProfile" },
        EmployeeSearchResult_Fragment,
      ),
    ),
  },
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
