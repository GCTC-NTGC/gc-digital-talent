import React from "react";
import type { StoryFn, Meta } from "@storybook/react";

import { OverlayOrDialogDecorator } from "@gc-digital-talent/storybook-helpers";

import Button from "../Button";
import AlertDialog from "./AlertDialog";

export default {
  component: AlertDialog.Root,
  title: "Components/Alert Dialog",
} as Meta<typeof AlertDialog.Root>;

type Args = React.ComponentProps<typeof AlertDialog.Root> & {
  theme: "dark" | "light";
};

const Template: StoryFn<Args> = (args) => {
  const [container, setContainer] = React.useState<HTMLElement | null>(null);
  const { defaultOpen, theme } = args;
  return (
    <>
      <AlertDialog.Root defaultOpen={defaultOpen}>
        <AlertDialog.Trigger>
          <Button>Open Alert Dialog</Button>
        </AlertDialog.Trigger>
        <AlertDialog.Content container={container || undefined}>
          <AlertDialog.Title>Example Alert Dialog</AlertDialog.Title>
          <AlertDialog.Description>
            <p>
              An alert dialog is a modal dialog that interrupts the user&apos;s
              workflow to communicate an important message and acquire a
              response. Examples include action confirmation prompts and error
              message confirmations.
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
      <div ref={setContainer} data-h2={theme} />
    </>
  );
};

export const DefaultLight = Template.bind({});
DefaultLight.decorators = [OverlayOrDialogDecorator];
DefaultLight.args = {
  defaultOpen: true,
  theme: "light",
};

export const DefaultDark = Template.bind({});
DefaultDark.decorators = [OverlayOrDialogDecorator];
DefaultDark.args = {
  defaultOpen: true,
  theme: "dark",
};

export const NotOpenLight = Template.bind({});
NotOpenLight.decorators = [
  (Story) => (
    <div style={{ width: "100%", height: "auto", margin: "1rem 0" }}>
      <Story />
    </div>
  ),
];
NotOpenLight.args = {
  defaultOpen: false,
  theme: "light",
};

export const NotOpenDark = Template.bind({});
NotOpenDark.decorators = [
  (Story) => (
    <div style={{ width: "100%", height: "auto", margin: "1rem 0" }}>
      <Story />
    </div>
  ),
];
NotOpenDark.args = {
  defaultOpen: false,
  theme: "dark",
};
