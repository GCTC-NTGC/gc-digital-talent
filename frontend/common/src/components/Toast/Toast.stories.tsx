import React from "react";
import { toast } from "react-toastify";
import type { Story, Meta } from "@storybook/react";

import Toast from "./Toast";

interface StoryArgs {
  text: string;
  longText: string;
}

export default {
  component: Toast,
  title: "Components/Toast",
  args: {
    text: "Toast text",
    longText:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In a laoreet tortor, a vulputate augue. Integer nec felis posuere, hendrerit nulla et, luctus neque.",
  },
} as Meta;

const Template: Story<StoryArgs> = (args) => {
  const { text, longText } = args;

  toast.success(text, { autoClose: false });
  toast.success(longText, { autoClose: false });
  toast.error(text, { autoClose: false });
  toast.error(longText, { autoClose: false });

  return <Toast />;
};

export const BasicToast = Template.bind({});
