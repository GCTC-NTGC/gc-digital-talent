import { Meta, StoryFn } from "@storybook/react";

import Separator from "./Separator";

export default {
  component: Separator,
} as Meta<typeof Separator>;

const Template: StoryFn<typeof Separator> = () => (
  <div data-h2-width="base(100%)" data-h2-max-width="base(320px)">
    <p>Separator for content</p>
    <Separator
      orientation="horizontal"
      data-h2-margin="base(x.5, 0)"
      data-h2-background-color="base(primary.50)"
    />
    <div
      data-h2-align-items="base(center)"
      data-h2-display="base(flex)"
      data-h2-justify-content="base(space-between)"
      data-h2-height="base(2rem)"
    >
      <p>Secondary</p>
      <Separator
        decorative
        orientation="vertical"
        data-h2-background-color="base(secondary.50)"
        data-h2-margin="base(0, x.5)"
      />
      <p>Red</p>
      <Separator
        decorative
        orientation="vertical"
        data-h2-background-color="base(tertiary.50)"
        data-h2-margin="base(0, x.5)"
      />
      <p>Vertical</p>
    </div>
  </div>
);

export const Default = Template.bind({});
