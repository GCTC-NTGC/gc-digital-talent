import React from "react";
import type { Meta, Story } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { fakeUsers } from "@common/fakeData";
import { User } from "../../api/generated";
import type { UpdateUserAsUserInput } from "../../api/generated";
import {
  DiversityEquityInclusionForm,
  type DiversityEquityInclusionFormProps,
} from "./DiversityEquityInclusionForm";

const userData = fakeUsers();

export default {
  component: DiversityEquityInclusionForm,
  title: "DiversityEquityInclusionForm",
  args: {
    user: userData[0],
    isMutating: false,
  },
  argTypes: {
    isMutating: {
      label: "Executing Mutation",
      type: { name: "boolean", required: false },
    },
  },
} as Meta;

const TemplateDiversityEquityInclusionForm: Story<
  DiversityEquityInclusionFormProps
> = ({ user, isMutating }) => (
  <DiversityEquityInclusionForm
    user={user}
    isMutating={isMutating}
    onUpdate={async (_: string, data: UpdateUserAsUserInput) => {
      await new Promise((resolve) => {
        setTimeout(() => {
          resolve(data);
        }, 1000);
      });
      action("Update Diversity, Equity, Inclusion Information")(data);
      return null;
    }}
  />
);

export const IndividualDiversityEquityInclusionForm =
  TemplateDiversityEquityInclusionForm.bind({});

export const LoadingDiversityEquityInclusionForm =
  TemplateDiversityEquityInclusionForm.bind({});

LoadingDiversityEquityInclusionForm.args = {
  isMutating: true,
};
