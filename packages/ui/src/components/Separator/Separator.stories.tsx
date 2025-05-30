import { Meta, StoryFn } from "@storybook/react";

import Separator from "./Separator";

export default {
  component: Separator,
} as Meta<typeof Separator>;

const Template: StoryFn<typeof Separator> = () => (
  <div className="w-full max-w-xs">
    <p>Separator for content</p>
    <Separator orientation="horizontal" className="bg-primary/50" space="xs" />
    <div className="flex h-8 items-center justify-between">
      <p>Secondary</p>
      <Separator
        decorative
        orientation="vertical"
        className="bg-secondary"
        space="xs"
      />
      <p>Red</p>
      <Separator
        decorative
        orientation="vertical"
        className="bg-error"
        space="xs"
      />
      <p>Vertical</p>
    </div>
  </div>
);

export const Default = Template.bind({});
