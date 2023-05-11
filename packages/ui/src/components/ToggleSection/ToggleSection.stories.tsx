import React from "react";
import type { ComponentStory, ComponentMeta } from "@storybook/react";
import AcademicCapIcon from "@heroicons/react/24/solid/AcademicCapIcon";

import { action } from "@storybook/addon-actions";
import ToggleSection from "./ToggleSection";
import Button from "../Button";

const Toggle = () => {
  const context = ToggleSection.useContext();

  return (
    <ToggleSection.Trigger>
      <Button mode="inline">{context?.open ? "Close" : "Open"} Section</Button>
    </ToggleSection.Trigger>
  );
};

export default {
  component: ToggleSection.Root,
  title: "Components/Toggle Section",
} as ComponentMeta<typeof ToggleSection.Root>;

const Template: ComponentStory<typeof ToggleSection.Root> = (args) => (
  <ToggleSection.Root
    {...args}
    onOpenChange={(open) => action("onOpenToggle")(open)}
  >
    <ToggleSection.Header Icon={AcademicCapIcon} toggle={<Toggle />}>
      Toggle Section
    </ToggleSection.Header>

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

const NestedTemplate: ComponentStory<typeof ToggleSection.Root> = (args) => (
  <ToggleSection.Root
    {...args}
    onOpenChange={(open) => action("onOpenToggle")(open)}
  >
    <ToggleSection.Header Icon={AcademicCapIcon} toggle={<Toggle />}>
      Toggle Section
    </ToggleSection.Header>

    <ToggleSection.Content data-h2-text-align="base(center)">
      <ToggleSection.InitialContent>
        <p>Initial Content Here</p>
        <ToggleSection.Open>
          <Button mode="inline">Open Main Content</Button>
        </ToggleSection.Open>

        <ToggleSection.Root>
          <ToggleSection.Trigger>
            <Button mode="inline">Toggle Nested Content</Button>
          </ToggleSection.Trigger>

          <ToggleSection.Content data-h2-text-align="base(center)">
            <ToggleSection.InitialContent>
              <p>Nested Initial Content Here</p>
            </ToggleSection.InitialContent>

            <ToggleSection.OpenContent>
              <p>Nested Open Content Here</p>
            </ToggleSection.OpenContent>
          </ToggleSection.Content>
        </ToggleSection.Root>
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

export const Nested = NestedTemplate.bind({});
