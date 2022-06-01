import React from "react";
import { Story, Meta } from "@storybook/react";
import NotAuthorized from "./NotAuthorized";

export default {
  component: NotAuthorized,
  title: "Components/Not Authorized",
} as Meta;

const Template: Story = (args) => {
  const { headingMessage, children } = args;
  return (
    <NotAuthorized headingMessage={headingMessage}>{children}</NotAuthorized>
  );
};

export const Example1 = Template.bind({});
Example1.args = {
  headingMessage: "Sorry, you are not authorized to view this page.",
  children: (
    <p>
      Oops, it looks like you&apos;ve landed on a page that you are not
      authorized to view.
    </p>
  ),
};
