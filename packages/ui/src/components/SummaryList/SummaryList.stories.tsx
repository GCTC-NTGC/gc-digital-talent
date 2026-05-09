import type { Meta, StoryObj } from "@storybook/react-vite";
import { action } from "storybook/actions";
import { useState } from "react";
import ArrowTopRightOnSquareIcon from "@heroicons/react/20/solid/ArrowTopRightOnSquareIcon";
import MagnifyingGlassPlusIcon from "@heroicons/react/20/solid/MagnifyingGlassPlusIcon";
import PencilSquareIcon from "@heroicons/react/20/solid/PencilSquareIcon";
import XMarkIcon from "@heroicons/react/20/solid/XMarkIcon";

import { allModes } from "@gc-digital-talent/storybook-helpers";

import SummaryList from "./SummaryList";
import SummaryItem from "./SummaryItem";
import type { Color } from "../../types";

const Text = () => (
  <p>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam quam dui,
    efficitur sed tempus at, luctus sit amet lacus. Cras accumsan massa vitae
    eros iaculis ullamcorper. Praesent a libero ipsum. Nullam at velit in turpis
    varius luctus. Phasellus quis lacus congue, scelerisque eros quis,
    condimentum elit.
  </p>
);

const ItemWithAction = () => {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);

  return (
    <SummaryList.Item>
      <SummaryList.Item.Action align="start" justify="start">
        <SummaryList.Item.ActionMenu.Root
          open={menuOpen}
          onOpenChange={setMenuOpen}
        >
          <SummaryList.Item.ActionMenu.Trigger
            icon={menuOpen ? XMarkIcon : PencilSquareIcon}
            label="Action menu"
          />
          <SummaryList.Item.ActionMenu.Popup>
            <SummaryList.Item.ActionMenu.Item
              onClick={() => {
                action("Clicked edit")();
              }}
            >
              Edit
            </SummaryList.Item.ActionMenu.Item>
            <SummaryList.Item.ActionMenu.Item
              onClick={() => {
                action("Clicked delete")();
              }}
            >
              Delete
            </SummaryList.Item.ActionMenu.Item>
          </SummaryList.Item.ActionMenu.Popup>
        </SummaryList.Item.ActionMenu.Root>
      </SummaryList.Item.Action>
      <SummaryList.Item.Content>
        <SummaryList.Item.Title>
          Item with a dropdown action menu
        </SummaryList.Item.Title>
        <Text />
      </SummaryList.Item.Content>
    </SummaryList.Item>
  );
};

export default {
  component: SummaryList.Root,
  parameters: {
    chromatic: {
      modes: {
        light: allModes.light,
        "light mobile": allModes["light mobile"],
        dark: allModes.dark,
      },
    },
    design: {
      type: "figma",
      url: "https://www.figma.com/design/guHeIIh8dqFVCks310Wv0G/Component-library?node-id=3353-78109&p=f",
    },
  },
  argTypes: {
    striped: {
      control: "boolean",
    },
  },
  args: {
    striped: false,
  },
  render: (args) => {
    return (
      <SummaryList.Root {...args}>
        <SummaryList.Item>
          <SummaryList.Item.Content>
            <SummaryList.Item.Title>Item 1</SummaryList.Item.Title>
            <Text />
          </SummaryList.Item.Content>
        </SummaryList.Item>
        <SummaryList.Item>
          <SummaryList.Item.Content>
            <SummaryList.Item.Title>
              Item with action button
            </SummaryList.Item.Title>
            <Text />
          </SummaryList.Item.Content>
          <SummaryList.Item.Action align="middle" justify="end" expand>
            <SummaryList.Item.ActionButton
              icon={MagnifyingGlassPlusIcon}
              onClick={() => {
                action("Click action")();
              }}
            />
          </SummaryList.Item.Action>
        </SummaryList.Item>
        <ItemWithAction />
      </SummaryList.Root>
    );
  },
} satisfies Meta<typeof SummaryList.Root>;

type Story = StoryObj<typeof SummaryList.Root>;

export const Default: Story = {};

export const Striped: Story = {
  args: {
    striped: true,
  },
};

export const Timeline: Story = {
  args: {
    timeline: true,
  },
};

export const TimelineSingle: Story = {
  args: {
    timeline: true,
  },
  render: (args) => (
    <SummaryList.Root {...args}>
      <SummaryList.Item>
        <SummaryList.Item.Content>
          <SummaryList.Item.Title>Single timeline item</SummaryList.Item.Title>
          <Text />
        </SummaryList.Item.Content>
      </SummaryList.Item>
    </SummaryList.Root>
  ),
};

export const TimelineWithActions: Story = {
  args: {
    timeline: true,
  },
  render: (args) => (
    <SummaryList.Root {...args}>
      {Array.from({ length: 3 }).map((_, index) => (
        <SummaryList.Item key={index}>
          <SummaryList.Item.Content>
            <SummaryList.Item.Title>Item {index}</SummaryList.Item.Title>
            <Text />
          </SummaryList.Item.Content>
          <SummaryList.Item.Action align="middle" justify="end" expand>
            <SummaryList.Item.ActionButton
              icon={MagnifyingGlassPlusIcon}
              label={`Item ${index}`}
              onClick={() => {
                action(`Clicked: ${index + 1}`)();
              }}
            />
          </SummaryList.Item.Action>
        </SummaryList.Item>
      ))}
    </SummaryList.Root>
  ),
};

const colors = [
  "primary",
  "secondary",
  "success",
  "warning",
  "error",
] satisfies Color[];

export const WithActionLink: Story = {
  render: (args) => (
    <SummaryList.Root {...args}>
      {colors.map((color) => (
        <SummaryList.Item key={color} color={color}>
          <SummaryList.Item.Content>
            <SummaryList.Item.Title>{color}</SummaryList.Item.Title>
            <Text />
          </SummaryList.Item.Content>
          <SummaryList.Item.Action align="middle" justify="end" expand>
            <SummaryList.Item.ActionLink
              icon={ArrowTopRightOnSquareIcon}
              label={`View ${color}`}
              href="#"
              external
            />
          </SummaryList.Item.Action>
        </SummaryList.Item>
      ))}
    </SummaryList.Root>
  ),
};

export const WithColor: Story = {
  render: (args) => (
    <SummaryList.Root {...args}>
      {colors.map((color) => (
        <SummaryList.Item key={color} color={color}>
          <SummaryList.Item.Content>
            <SummaryList.Item.Title>{color}</SummaryList.Item.Title>
            <Text />
          </SummaryList.Item.Content>
          <SummaryList.Item.Action justify="end" align="middle" expand>
            <SummaryList.Item.ActionButton
              icon={MagnifyingGlassPlusIcon}
              onClick={() => {
                action(`Clicked: ${color}`)();
              }}
              label={color}
            />
          </SummaryList.Item.Action>
        </SummaryList.Item>
      ))}
    </SummaryList.Root>
  ),
};

export const StandaloneItem: Story = {
  render: () => (
    <SummaryItem.Root>
      <SummaryItem.Content>
        <SummaryItem.Title>Standalone item</SummaryItem.Title>
        <Text />
      </SummaryItem.Content>
      <SummaryItem.Action align="middle" justify="end" expand>
        <SummaryItem.ActionButton
          icon={MagnifyingGlassPlusIcon}
          label="View"
          onClick={() => {
            action("Clicked")();
          }}
        />
      </SummaryItem.Action>
    </SummaryItem.Root>
  ),
};
