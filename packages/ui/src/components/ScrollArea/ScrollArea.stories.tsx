import React from "react";
import type { StoryFn, Meta } from "@storybook/react";

import { allModes } from "@gc-digital-talent/storybook-helpers";

import ScrollArea from "./ScrollArea";

export default {
  component: ScrollArea.Root,
  title: "Components/Scroll Area",
  parameters: {
    chromatic: {
      modes: {
        light: allModes.light,
        dark: allModes.dark,
      },
    },
  },
} as Meta<typeof ScrollArea.Root>;

const ITEMS = Array.from({ length: 50 }).map(
  (_, i, a) => `List item ${a.length - i}`,
);

const Template: StoryFn<typeof ScrollArea.Root> = (args) => {
  return (
    <ScrollArea.Root
      style={{
        height: 250,
        width: 320,
      }}
      {...args}
    >
      <ScrollArea.Viewport data-h2-background-color="base(white)">
        <div data-h2-padding="base(x.25, x.5)">
          {ITEMS.map((item) => (
            <p key={item}>{item}</p>
          ))}
        </div>
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar orientation="vertical">
        <ScrollArea.Thumb />
      </ScrollArea.Scrollbar>
    </ScrollArea.Root>
  );
};

export const Default = Template.bind({});
