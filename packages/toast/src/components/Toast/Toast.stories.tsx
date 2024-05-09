import React from "react";
import type { StoryFn, Meta } from "@storybook/react";
import { faker } from "@faker-js/faker/locale/en";

import { OverlayOrDialogDecorator } from "@gc-digital-talent/storybook-helpers";

import toast from "../../toast";
import Toast from "./Toast";
import "./toast.css";

interface StoryArgs {
  text: string;
  longText: string;
}

faker.seed(0);

export default {
  component: Toast,
  args: {
    text: "Toast text",
    longText: faker.lorem.sentences(3),
  },
  decorators: [OverlayOrDialogDecorator],
} as Meta;

const Template: StoryFn<StoryArgs> = (args) => {
  const { text, longText } = args;

  toast.info(text);
  toast.info(longText);
  toast.success(text);
  toast.warning(text);
  toast.error(text);

  // avoid animations with Chromatic snapshots
  return (
    <div>
      <Toast disableTransition autoClose={false} />
    </div>
  );
};

export const Default = Template.bind({});
