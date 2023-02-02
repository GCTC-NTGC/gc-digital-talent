import React from "react";
import { Meta, Story } from "@storybook/react";

import LoginPage from "./LoginPage";

export default {
  component: LoginPage,
  title: "Pages/Login Page",
} as Meta;

const TemplateLoginPage: Story = () => <LoginPage />;

export const Default = TemplateLoginPage.bind({});
