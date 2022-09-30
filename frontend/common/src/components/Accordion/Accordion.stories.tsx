import React from "react";
import type { ComponentStory, ComponentMeta } from "@storybook/react";
import { AcademicCapIcon } from "@heroicons/react/24/solid";

import Accordion from ".";

export default {
  component: Accordion.Root,
  title: "Components/Accordion",
} as ComponentMeta<typeof Accordion.Root>;

const Template: ComponentStory<typeof Accordion.Root> = ({
  children,
  ...rest
}) => {
  return (
    <Accordion.Root {...rest}>
      <Accordion.Item value="one">
        <Accordion.Trigger Icon={AcademicCapIcon} subtitle="Subtitle">
          Accordion One
        </Accordion.Trigger>
        <Accordion.Content>{children}</Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  );
};

const Text = () => (
  <p>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vulputate urna
    quam, id lacinia mauris condimentum molestie. Interdum et malesuada fames ac
    ante ipsum primis in faucibus. Sed porttitor, elit vel consequat efficitur,
    est sapien rhoncus mi, nec maximus libero augue a nisi. Vivamus et turpis
    non magna tincidunt vulputate non tristique libero.
  </p>
);

export const Default = Template.bind({});
Default.args = {
  type: "single",
  collapsible: true,
  children: <Text />,
};

export const DefaultOpen = Template.bind({});
DefaultOpen.args = {
  defaultValue: "one",
  type: "single",
  collapsible: true,
  children: <Text />,
};

export const Nested = Template.bind({});
Nested.args = {
  type: "single",
  collapsible: true,
  children: (
    <>
      <Text />
      <Accordion.Root
        type="single"
        collapsible
        data-h2-margin="base(x1, 0, 0, 0)"
      >
        <Accordion.Item value="two">
          <Accordion.Trigger Icon={AcademicCapIcon} subtitle="Subtitle">
            Accordion Two
          </Accordion.Trigger>
          <Accordion.Content>
            <Text />
          </Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>
    </>
  ),
};
