import React from "react";
import type { Story, Meta } from "@storybook/react";
import { faker } from "@faker-js/faker";

import toast from "../../toast";
import Toast from "./Toast";
import "./toast.css";
import ToastDocs from "./Toast.docs.mdx";

interface StoryArgs {
  text: string;
  longText: string;
}

faker.seed(0);

export default {
  component: Toast,
  title: "Components/Toast",
  args: {
    text: "Toast text",
    longText: faker.lorem.sentences(3),
  },
  parameters: {
    docs: {
      page: ToastDocs,
    },
  },
} as Meta;

const Template: Story<StoryArgs> = (args) => {
  const { text, longText } = args;

  toast.info(text, { autoClose: false });
  toast.info(longText, { autoClose: false });
  toast.success(text, { autoClose: false });
  toast.warning(text, { autoClose: false });
  toast.error(text, { autoClose: false });

  // avoid animations with Chromatic snapshots
  return <Toast disableTransition autoClose={false} />;
};

export const BasicToast = Template.bind({});
