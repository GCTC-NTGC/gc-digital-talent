import React from "react";
import { Meta, Story } from "@storybook/react";

import LoggedOutPage from "./LoggedOutPage";

export default {
  component: LoggedOutPage,
  title: "Logged Out Page",
} as Meta;

const TemplateLoggedOutPage: Story = () => <LoggedOutPage />;

export const IndividualLoggedOutPage = TemplateLoggedOutPage.bind({});
