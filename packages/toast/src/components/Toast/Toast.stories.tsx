import React from "react";
import type { Story, Meta } from "@storybook/react";
import { faker } from "@faker-js/faker";

import Toast from "./Toast";
import toast from "../../toast";
import "./toast.css";

interface StoryArgs {
  text: string;
  longText: string;
}

export default {
  component: Toast,
  title: "Components/Toast",
  args: {
    text: "Toast text",
    longText: faker.lorem.sentences(3),
  },
} as Meta;

const Template: Story<StoryArgs> = (args) => {
  const { text, longText } = args;

  toast.info(text, { autoClose: false });
  toast.info(longText, { autoClose: false });
  toast.success(text, { autoClose: false });
  toast.warning(text, { autoClose: false });
  toast.error(text, { autoClose: false });

  return <Toast />;
};

export const BasicToast = Template.bind({});
