import React from "react";
import type { ComponentStory, ComponentMeta } from "@storybook/react";

import OverlayOrDialogDecorator from "../../../.storybook/decorators/OverlayOrDialogDecorator";

import Button from "../Button";

import AlertDialog from ".";

export default {
  component: AlertDialog.Root,
  title: "Components/Alert Dialog",
  decorators: [OverlayOrDialogDecorator],
} as ComponentMeta<typeof AlertDialog.Root>;

const Template: ComponentStory<typeof AlertDialog.Root> = () => {
  const [container, setContainer] = React.useState<HTMLElement | null>(null);
  return (
    <>
      <AlertDialog.Root defaultOpen>
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
