import React from "react";
import type { StoryFn, Meta } from "@storybook/react";

import {
  OverlayOrDialogDecorator,
  allModes,
} from "@gc-digital-talent/storybook-helpers";

import Button from "../Button";
import AlertDialog from "./AlertDialog";

export default {
  component: AlertDialog.Root,
  title: "Components/Alert Dialog",
  decorators: [OverlayOrDialogDecorator],
  args: { defaultOpen: true },
  parameters: {
    chromatic: {
      modes: {
        light: allModes.light,
        "light mobile": allModes["light mobile"],
        dark: allModes.dark,
      },
    },
  },
} as Meta<typeof AlertDialog.Root>;

const Template: StoryFn<typeof AlertDialog.Root> = ({ defaultOpen }) => (
  <AlertDialog.Root defaultOpen={defaultOpen}>
    <AlertDialog.Trigger>
      <Button>Open Alert Dialog</Button>
    </AlertDialog.Trigger>
    <AlertDialog.Content>
      <AlertDialog.Title>Example Alert Dialog</AlertDialog.Title>
      <AlertDialog.Description>
        <p>
          An alert dialog is a modal dialog that interrupts the user&apos;s
          workflow to communicate an important message and acquire a response.
          Examples include action confirmation prompts and error message
          confirmations.
        </p>
      </AlertDialog.Description>
      <AlertDialog.Footer>
        <AlertDialog.Cancel>
          <Button color="secondary" mode="inline">
            Cancel
          </Button>
        </AlertDialog.Cancel>
        <AlertDialog.Action>
          <Button color="primary" mode="solid">
            Action
          </Button>
        </AlertDialog.Action>
      </AlertDialog.Footer>
    </AlertDialog.Content>
  </AlertDialog.Root>
);

export const Default = Template.bind({});
