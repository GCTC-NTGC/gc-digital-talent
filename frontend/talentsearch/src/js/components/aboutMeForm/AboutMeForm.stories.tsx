import React from "react";
import type { Meta, Story } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { fakeUsers } from "@common/fakeData";
import { User } from "../../api/generated";
import type { UpdateUserAsUserInput } from "../../api/generated";
import { AboutMeForm } from "./AboutMeForm";

const userData = fakeUsers();

export default {
  component: AboutMeForm,
  title: "AboutMeForm",
  args: {
    user: userData[0],
  },
} as Meta;

const TemplateAboutMeForm: Story<{ user: User }> = ({ user }) => (
  <AboutMeForm
    initialUser={user}
    onUpdateAboutMe={async (_: string, data: UpdateUserAsUserInput) => {
      await new Promise((resolve) => {
        setTimeout(() => {
          resolve(data);
        }, 1000);
      });
      action("Update About Me")(data);
      return null;
    }}
  />
);

export const IndividualAboutMe = TemplateAboutMeForm.bind({});
