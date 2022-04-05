import React from "react";
import type { Meta, Story } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import Form from "@common/components/form/BasicForm";
import Submit from "@common/components/form/Submit";
import AboutMeForm from "./AboutMeForm";
import type { FormValues } from "./AboutMeForm";

export default {
  component: AboutMeForm,
  title: "AboutMeForm",
} as Meta;

const TemplateAboutMeForm: Story = () => (
  <AboutMeForm
    onSubmit={async (data: FormValues) => {
      action("submit")(data);
    }}
  />
);

export const IndividualAboutMe = TemplateAboutMeForm.bind({});
