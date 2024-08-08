import { Meta, StoryFn } from "@storybook/react";

import PreviewItem from "./PreviewItem";
import Chip from "../Chip/Chip";
import { allModes } from "@gc-digital-talent/storybook-helpers";

export const previewDetails = [
  <Chip color="primary">Approved</Chip>,
  "IT-01",
  "Yonathan Kidanemariam",
  <span>
    Apply on or before:{" "}
    <span data-h2-color="base(error)">April 30th, 2024</span>
  </span>,
];

export default {
  component: PreviewItem,
  args: {
    title: "Preview Item",
    details: previewDetails,
    buttonName: "View preview item",
  },
  parameters: {
    layout: "fullscreen",
    chromatic: {
      modes: {
        light: allModes.light,
        dark: allModes.dark,
      },
    },
  },
} as Meta<typeof PreviewItem>;

const Template: StoryFn<typeof PreviewItem> = (args) => {
  return <PreviewItem {...args} />;
};

export const Default = Template.bind({});
