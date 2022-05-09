import React from "react";
import { action } from "@storybook/addon-actions";
import { Meta, Story } from "@storybook/react";
import { JobLookingStatus, UpdateUserAsUserInput } from "../../api/generated";

import { MyStatusForm } from "./MyStatusForm";

export default {
  component: MyStatusForm,
  title: "MyStatusForm",
  args: {},
} as Meta;

const TemplateMyStatusForm: Story = (args) => {
  return (
    <MyStatusForm
      initialData={args}
      handleMyStatus={async (_: string, data: UpdateUserAsUserInput) => {
        await new Promise((resolve) => {
          setTimeout(() => {
            resolve(data);
          }, 1000);
        });
        action("Update My Status")(data);
        return null;
      }}
    />
  );
};

export const MyStatusFormNull = TemplateMyStatusForm.bind({});
export const MyStatusFormActive = TemplateMyStatusForm.bind({});

MyStatusFormNull.args = {
  __typename: "Query",
  me: {
    __typename: "User",
    id: "11",
    jobLookingStatus: JobLookingStatus.ActivelyLooking,
    isProfileActive: false,
  },
};
MyStatusFormActive.args = {
  __typename: "Query",
  me: {
    __typename: "User",
    id: "11",
    jobLookingStatus: JobLookingStatus.ActivelyLooking,
    isProfileActive: true,
  },
};
