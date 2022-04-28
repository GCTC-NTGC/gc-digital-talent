import React from "react";
import type { Meta, Story } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { fakeUsers } from "@common/fakeData";
import { User } from "../../api/generated";
import type { UpdateUserAsUserInput } from "../../api/generated";
import { MyStatusForm } from "./MyStatusForm";

const userData = fakeUsers();

export default {
  component: MyStatusForm,
  title: "MyStatusForm",
  args: {
    user: userData[0],
  },
} as Meta;

const TemplateMyStatusForm: Story<{ user: User }> = ({ user }) => (
  <MyStatusForm
    initialData={user}
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

export const IndividualMyStatus = TemplateMyStatusForm.bind({});
