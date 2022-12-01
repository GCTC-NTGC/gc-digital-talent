import React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";

import SeparatorDocs from "./Separator.docs.mdx";
import Separator from "./Separator";

export default {
  component: Separator,
  title: "Components/Separator",
  parameters: {
    docs: {
      page: SeparatorDocs,
    },
  },
} as ComponentMeta<typeof Separator>;

const Template: ComponentStory<typeof Separator> = () => (
  <div data-h2-width="base(100%)" data-h2-max-width="base(320px)">
    <p>Separator for content</p>
    <Separator
      orientation="horizontal"
      data-h2-margin="base(x.5, 0)"
      data-h2-background-color="base(dt-primary.50)"
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
        data-h2-background-color="base(dt-secondary.50)"
        data-h2-margin="base(0, x.5)"
      />
      <p>Red</p>
      <Separator
        decorative
        orientation="vertical"
        data-h2-background-color="base(tm-red.50)"
        data-h2-margin="base(0, x.5)"
      />
      <p>Vertical</p>
    </div>
  </div>
);

export const Default = Template.bind({});
