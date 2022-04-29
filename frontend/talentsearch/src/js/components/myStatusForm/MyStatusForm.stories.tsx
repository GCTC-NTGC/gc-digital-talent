import React from "react";
import { action } from "@storybook/addon-actions";
import { Meta, Story } from "@storybook/react";
import {
  GetMystatusQuery,
  JobLookingStatus,
  UpdateUserAsUserInput,
} from "../../api/generated";

import { MyStatusForm } from "./MyStatusForm";

const mockUser: GetMystatusQuery | undefined = {
  __typename: "Query",
  me: {
    __typename: "User",
    id: "11",
    jobLookingStatus: JobLookingStatus.ActivelyLooking,
    email: "eee@lkj.com",
  },
};

export default {
  component: MyStatusForm,
  title: "MyStatusForm",
} as Meta;

const TemplateMyStatusForm: Story = () => {
  return (
    <MyStatusForm
      initialData={mockUser}
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

export const IndividualMystatus = TemplateMyStatusForm.bind({});
