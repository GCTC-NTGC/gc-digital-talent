import React from "react";
import type { ComponentStory, ComponentMeta } from "@storybook/react";

import OverlayOrDialogDecorator from "../../../.storybook/decorators/OverlayOrDialogDecorator";

import Button from "../Button";

import Dialog from ".";

export default {
  component: Dialog.Root,
  title: "Components/Dialog",
  decorators: [OverlayOrDialogDecorator],
  argTypes: {
    children: { control: { disable: true } },
  },
} as ComponentMeta<typeof Dialog.Root>;

const Template: ComponentStory<typeof Dialog.Root> = (args) => {
  const [container, setContainer] = React.useState<HTMLElement | null>(null);
  const { children } = args;
  return (
    <>
      <Dialog.Root defaultOpen>
        <Dialog.Trigger>
          <Button>Open Dialog</Button>
        </Dialog.Trigger>
        <Dialog.Content container={container || undefined}>
          <Dialog.Header
            color="ia-primary"
            subtitle="A dialog is a window overlaid on either the primary window or another dialog window."
          >
            Example Dialog
          </Dialog.Header>
          {children}
          <Dialog.Footer>
            <Dialog.Close>
              <Button color="cta">Close</Button>
            </Dialog.Close>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Root>
      <div ref={setContainer} />
    </>
  );
};

export const Default = Template.bind({});
Default.args = {
  children: (
    <p>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam efficitur leo
      a tellus imperdiet, quis imperdiet nulla viverra. Aliquam porttitor
      pellentesque rhoncus.
    </p>
  ),
};
