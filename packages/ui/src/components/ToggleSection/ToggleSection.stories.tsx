import React from "react";
import type { ComponentStory, ComponentMeta } from "@storybook/react";

import ToggleSection from "./ToggleSection";
import Heading from "../Heading";
import Button from "../Button";

export default {
  component: ToggleSection.Root,
  title: "Components/Toggle Section",
} as ComponentMeta<typeof ToggleSection.Root>;

const Template: ComponentStory<typeof ToggleSection.Root> = (args) => (
  <ToggleSection.Root {...args}>
    <Heading>Toggle Section</Heading>
    <ToggleSection.Trigger>
      <Button mode="inline">Open/Close</Button>
    </ToggleSection.Trigger>

    <ToggleSection.Content data-h2-text-align="base(center)">
      <ToggleSection.InitialContent>
        <p>Initial Content Here</p>
        <ToggleSection.Open>
          <Button mode="inline">Open</Button>
        </ToggleSection.Open>
      </ToggleSection.InitialContent>

      <ToggleSection.OpenContent>
        <p>Open Content Here</p>
        <ToggleSection.Close>
          <Button mode="inline">Close</Button>
        </ToggleSection.Close>
      </ToggleSection.OpenContent>
    </ToggleSection.Content>
  </ToggleSection.Root>
);

export const Default = Template.bind({});
