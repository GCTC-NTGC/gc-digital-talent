import React from "react";
import type { Meta, Story } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { fakeUsers } from "@common/fakeData";
import AboutMeForm from "./AboutMeForm";
import type { FormValues } from "./AboutMeForm";
import { User } from "../../api/generated";

export default {
  component: AboutMeForm,
  title: "AboutMeForm",
  args: fakeUsers()[0],
} as Meta;

const TemplateAboutMeForm: Story<User> = (args) => (
  <AboutMeForm
    me={args}
    onSubmit={async (data: FormValues) => {
      action("submit")(data);
    }}
  />
);

export const IndividualAboutMe = TemplateAboutMeForm.bind({});
