import React from "react";
import type { ComponentStory, ComponentMeta } from "@storybook/react";

import { OverlayOrDialogDecorator } from "storybook-helpers";

import Button from "../Button";

import AlertDialogDocs from "./AlertDialog.docs.mdx";
import AlertDialog from "./AlertDialog";

export default {
  component: AlertDialog.Root,
  title: "Components/Alert Dialog",
  parameters: {
    docs: {
      page: AlertDialogDocs,
    },
  },
} as ComponentMeta<typeof AlertDialog.Root>;

const Template: ComponentStory<typeof AlertDialog.Root> = ({ defaultOpen }) => {
  const [container, setContainer] = React.useState<HTMLElement | null>(null);
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
              <Button color="white">Cancel</Button>
            </AlertDialog.Cancel>
            <AlertDialog.Action>
              <Button color="cta">Action</Button>
            </AlertDialog.Action>
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog.Root>
      <div ref={setContainer} />
    </>
  );
};

export const Default = Template.bind({});
Default.decorators = [OverlayOrDialogDecorator];
Default.args = {
  defaultOpen: true,
};

export const NotOpen = Template.bind({});
NotOpen.decorators = [
  (Story) => (
    <div style={{ width: "100%", height: "auto", margin: "1rem 0" }}>
      <Story />
    </div>
  ),
];
NotOpen.args = {
  defaultOpen: false,
};
