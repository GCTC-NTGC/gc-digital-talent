import React from "react";
import type { ComponentStory, ComponentMeta } from "@storybook/react";
import { faker } from "@faker-js/faker";

import { OverlayOrDialogDecorator } from "storybook-helpers";

import Button from "../Button";

import DialogDocs from "./Dialog.docs.mdx";
import Dialog from "./Dialog";

export default {
  component: Dialog.Root,
  title: "Components/Dialog",
  decorators: [OverlayOrDialogDecorator],
  parameters: {
    docs: {
      page: DialogDocs,
    },
  },
} as ComponentMeta<typeof Dialog.Header>;

const Template: ComponentStory<typeof Dialog.Header> = (args) => {
  const [container, setContainer] = React.useState<HTMLElement | null>(null);
  const { children, subtitle } = args;
  faker.seed(0);
  return (
    <>
      <Dialog.Root defaultOpen>
        <Dialog.Trigger>
          <Button>Open Dialog</Button>
        </Dialog.Trigger>
        <Dialog.Content container={container || undefined}>
          <Dialog.Header subtitle={subtitle}>{children}</Dialog.Header>
          <Dialog.Body>
            <p>{faker.lorem.sentences(3)}</p>
            <Dialog.Footer>
              <Dialog.Close>
                <Button color="primary">Close</Button>
              </Dialog.Close>
            </Dialog.Footer>
          </Dialog.Body>
        </Dialog.Content>
      </Dialog.Root>
      <div ref={setContainer} />
    </>
  );
};

export const Basic = Template.bind({});
Basic.args = {
  children: "Basic Dialog",
};

export const WithSubtitle = Template.bind({});
WithSubtitle.args = {
  children: "Basic Dialog",
  subtitle:
    "A dialog is a window overlaid on either the primary window or another dialog window.",
};
