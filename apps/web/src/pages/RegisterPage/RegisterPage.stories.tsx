import React from "react";
import { Meta, Story } from "@storybook/react";

import RegisterPage from "./RegisterPage";

export default {
  component: RegisterPage,
  title: "Pages/Register Page",
} as Meta;

const TemplateRegisterPage: Story = () => <RegisterPage />;

export const Default = TemplateRegisterPage.bind({});
