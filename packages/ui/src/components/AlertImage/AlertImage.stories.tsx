import React from "react";
import { StoryFn, Meta } from "@storybook/react";

import AlertImage from "./AlertImage";

export default {
  component: AlertImage,
  title: "Components/Alert Image",
} as Meta;

const Template: StoryFn<typeof AlertImage> = (args) => <AlertImage {...args} />;

const message = (
  <div
    data-h2-justify-content="base(space-between)"
    data-h2-max-height="base(100%)"
  >
    <h2>Happy Holidays!</h2>
    <p>It&apos;s time for a well-deserved break; you earned it!</p>
    <p>There will be no job postings during the holidays (Dec 22-Jan 7).</p>
    <p>
      So kick back, relax, and enjoy the holiday season with your loved ones.
      See you in the new year!
    </p>
  </div>
);

export const Default = Template.bind({});
Default.args = {
  message,
  lightImage: "https://placehold.co/600x400/EEE/31343C",
  darkImage: "https://placehold.co/600x400/EEE/31343C",
};
