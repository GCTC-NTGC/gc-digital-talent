import type { Meta, StoryObj } from "@storybook/react-vite";
import { action } from "storybook/actions";
import { useRef, useState } from "react";
import ArrowTopRightOnSquareIcon from "@heroicons/react/20/solid/ArrowTopRightOnSquareIcon";
import EllipsisHorizontalIcon from "@heroicons/react/20/solid/EllipsisHorizontalIcon";
import MagnifyingGlassPlusIcon from "@heroicons/react/20/solid/MagnifyingGlassPlusIcon";
import PencilSquareIcon from "@heroicons/react/20/solid/PencilSquareIcon";
import XMarkIcon from "@heroicons/react/20/solid/XMarkIcon";

import { allModes } from "@gc-digital-talent/storybook-helpers";

import SummaryList from "./SummaryList";
import SummaryItem from "./SummaryItem";
import Dialog from "../Dialog/Dialog";
import { COLOR, type Color } from "../../types";
import Button from "../Button";

const Text = () => (
  <p className="not-last:mb-3">
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
    <SummaryItem.Root>
      <SummaryItem.Action align="start" justify="start">
        <SummaryItem.Menu open={menuOpen} onOpenChange={setMenuOpen}>
          <SummaryItem.Menu.Trigger
            icon={menuOpen ? XMarkIcon : PencilSquareIcon}
            label="Action menu"
          />
          <SummaryItem.Menu.Popup>
            <SummaryItem.Menu.Item
              onClick={() => {
                action("Clicked edit")();
              }}
            >
              Edit
            </SummaryItem.Menu.Item>
            <SummaryItem.Menu.Item
              onClick={() => {
                action("Clicked delete")();
              }}
            >
              Delete
            </SummaryItem.Menu.Item>
          </SummaryItem.Menu.Popup>
        </SummaryItem.Menu>
      </SummaryItem.Action>
      <SummaryItem.Content>
        <SummaryItem.Title>Item with a dropdown action menu</SummaryItem.Title>
        <Text />
      </SummaryItem.Content>
    </SummaryItem.Root>
  );
};

export default {
  component: SummaryList,
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
    divider: {
      control: "select",
      options: [undefined, "line", "timeline"],
    },
    mode: {
      control: "inline-radio",
      options: ["simple", "card"],
    },
    color: {
      control: "select",
      options: Object.values(COLOR).filter(
        (color) => color !== COLOR.WHITE && color !== COLOR.BLACK,
      ),
    },
  },
  args: {
    striped: false,
    divider: "line",
  },
  render: (args) => {
    return (
      <SummaryList {...args}>
        <SummaryItem.Root>
          <SummaryItem.Content>
            <SummaryItem.Title>Item 1</SummaryItem.Title>
            <Text />
          </SummaryItem.Content>
        </SummaryItem.Root>
        <SummaryItem.Root>
          <SummaryItem.Content>
            <SummaryItem.Title>Item with action button</SummaryItem.Title>
            <Text />
          </SummaryItem.Content>
          <SummaryItem.Action align="middle" justify="end" expand>
            <SummaryItem.Button
              icon={MagnifyingGlassPlusIcon}
              onClick={() => {
                action("Click action")();
              }}
            />
          </SummaryItem.Action>
        </SummaryItem.Root>
        <SummaryItem.Root>
          <SummaryItem.Content>
            <SummaryItem.Title>Item with a lot of text</SummaryItem.Title>
            <Text />
            <Text />
            <Text />
          </SummaryItem.Content>
        </SummaryItem.Root>
        <ItemWithAction />
        <SummaryItem.Root>
          <SummaryItem.Content>
            <SummaryItem.Title>Item 1</SummaryItem.Title>
            <Text />
            <SummaryItem.Meta separator>
              <Button
                mode="inline"
                color={args.color}
                onClick={() => {
                  action("Click: meta one")();
                }}
              >
                Meta one
              </Button>
              <Button
                mode="inline"
                color={args.color}
                onClick={() => {
                  action("Click: meta two")();
                }}
              >
                Meta two
              </Button>
            </SummaryItem.Meta>
          </SummaryItem.Content>
        </SummaryItem.Root>
      </SummaryList>
    );
  },
} satisfies Meta<typeof SummaryList>;

type Story = StoryObj<typeof SummaryList>;

export const Default: Story = {};

export const Striped: Story = {
  args: {
    striped: true,
  },
};

export const Timeline: Story = {
  args: {
    divider: "timeline",
  },
};

export const AsCard: Story = {
  args: {
    mode: "card",
  },
};

export const TimelineSingle: Story = {
  args: {
    divider: "timeline",
  },
  render: (args) => (
    <SummaryList {...args}>
      <SummaryItem.Root>
        <SummaryItem.Content>
          <SummaryItem.Title>Single timeline item</SummaryItem.Title>
          <Text />
        </SummaryItem.Content>
      </SummaryItem.Root>
    </SummaryList>
  ),
};

export const TimelineWithActions: Story = {
  args: {
    divider: "timeline",
  },
  render: (args) => (
    <SummaryList {...args}>
      {Array.from({ length: 3 }).map((_, index) => (
        <SummaryItem.Root key={index}>
          <SummaryItem.Content>
            <SummaryItem.Title>Item {index}</SummaryItem.Title>
            <Text />
          </SummaryItem.Content>
          <SummaryItem.Action align="middle" justify="end" expand>
            <SummaryItem.Button
              icon={MagnifyingGlassPlusIcon}
              label={`Item ${index}`}
              onClick={() => {
                action(`Clicked: ${index + 1}`)();
              }}
            />
          </SummaryItem.Action>
        </SummaryItem.Root>
      ))}
    </SummaryList>
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
    <SummaryList {...args}>
      {colors.map((color) => (
        <SummaryItem.Root key={color} color={color}>
          <SummaryItem.Content>
            <SummaryItem.Title>{color}</SummaryItem.Title>
            <Text />
          </SummaryItem.Content>
          <SummaryItem.Action align="middle" justify="end" expand>
            <SummaryItem.Link
              icon={ArrowTopRightOnSquareIcon}
              label={`View ${color}`}
              href="#"
              external
            />
          </SummaryItem.Action>
        </SummaryItem.Root>
      ))}
    </SummaryList>
  ),
};

/**
 * Two patterns for opening dialogs from summary item actions.
 *
 * Button: wrap with Dialog.Trigger (asChild by default) — Radix restores focus
 * to the button automatically on close.
 *
 * Menu item (detached trigger): the menu item unmounts when the menu closes,
 * so Radix cannot restore focus to it. Store a ref to the menu trigger button
 * and use onCloseAutoFocus to focus it manually instead.
 */
const WithDialogsExample = () => {
  const [menuDialogOpen, setMenuDialogOpen] = useState(false);
  const menuTriggerRef = useRef<HTMLButtonElement>(null);

  return (
    <>
      {/* Detached dialog — sits outside the list, opened via controlled state */}
      <Dialog.Root open={menuDialogOpen} onOpenChange={setMenuDialogOpen}>
        <Dialog.Content
          onCloseAutoFocus={(e) => {
            e.preventDefault();
            menuTriggerRef.current?.focus();
          }}
        >
          <Dialog.Header>Edit item</Dialog.Header>
          <Dialog.Body>
            <p>
              This dialog was opened from a menu item. When it closes, focus
              returns to the menu trigger button via the ref.
            </p>
          </Dialog.Body>
        </Dialog.Content>
      </Dialog.Root>

      <SummaryList>
        {/* Pattern 1: Dialog.Trigger wraps Button — focus is automatic */}
        <Dialog.Root>
          <SummaryItem.Root>
            <SummaryItem.Content>
              <SummaryItem.Title>Action button trigger</SummaryItem.Title>
              <p>
                Dialog.Trigger (asChild) merges onto the button. Radix tracks
                the trigger and restores focus automatically when the dialog
                closes.
              </p>
            </SummaryItem.Content>
            <SummaryItem.Action align="middle" justify="end">
              <Dialog.Trigger>
                <SummaryItem.Button icon={PencilSquareIcon} label="Edit" />
              </Dialog.Trigger>
            </SummaryItem.Action>
          </SummaryItem.Root>
          <Dialog.Content>
            <Dialog.Header>Edit item</Dialog.Header>
            <Dialog.Body>
              <p>
                Focus will return to the edit button automatically when this
                dialog closes.
              </p>
            </Dialog.Body>
          </Dialog.Content>
        </Dialog.Root>

        {/* Pattern 2: menu item opens dialog — focus restored manually via ref */}
        <SummaryItem.Root>
          <SummaryItem.Content>
            <SummaryItem.Title>Menu item trigger</SummaryItem.Title>
            <p>
              The menu item unmounts when the menu closes, so Radix cannot track
              it. A ref on the menu trigger combined with onCloseAutoFocus
              handles focus restoration instead.
            </p>
          </SummaryItem.Content>
          <SummaryItem.Action align="start" justify="start">
            <SummaryItem.Menu>
              <SummaryItem.Menu.Trigger
                ref={menuTriggerRef}
                icon={EllipsisHorizontalIcon}
                label="Options"
              />
              <SummaryItem.Menu.Popup>
                <SummaryItem.Menu.Item onClick={() => setMenuDialogOpen(true)}>
                  Edit
                </SummaryItem.Menu.Item>
              </SummaryItem.Menu.Popup>
            </SummaryItem.Menu>
          </SummaryItem.Action>
        </SummaryItem.Root>
      </SummaryList>
    </>
  );
};

export const WithDialogs: Story = {
  render: () => <WithDialogsExample />,
};

export const WithColor: Story = {
  render: (args) => (
    <SummaryList {...args}>
      {colors.map((color) => (
        <SummaryItem.Root key={color} color={color}>
          <SummaryItem.Content>
            <SummaryItem.Title>{color}</SummaryItem.Title>
            <Text />
          </SummaryItem.Content>
          <SummaryItem.Action justify="end" align="middle" expand>
            <SummaryItem.Button
              icon={MagnifyingGlassPlusIcon}
              onClick={() => {
                action(`Clicked: ${color}`)();
              }}
              label={color}
            />
          </SummaryItem.Action>
        </SummaryItem.Root>
      ))}
    </SummaryList>
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
        <SummaryItem.Button
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
