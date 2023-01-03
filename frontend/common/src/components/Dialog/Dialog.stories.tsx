import React from "react";
import type { ComponentStory, ComponentMeta } from "@storybook/react";

import { faker } from "@faker-js/faker";
import OverlayOrDialogDecorator from "../../../.storybook/decorators/OverlayOrDialogDecorator";

import Button from "../Button";

import DialogDocs from "./Dialog.docs.mdx";
import Dialog from ".";

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
  const { children, color, subtitle } = args;
  return (
    <>
      <Dialog.Root defaultOpen>
        <Dialog.Trigger>
          <Button>Open Dialog</Button>
        </Dialog.Trigger>
        <Dialog.Content container={container || undefined}>
          <Dialog.Header color={color} subtitle={subtitle}>
            {children}
          </Dialog.Header>
          <p>{faker.lorem.sentences(3)}</p>
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

export const ColorSecondary = Template.bind({});
ColorSecondary.args = {
  children: "Secondary Dialog",
  color: "ts-secondary",
};

export const ColorIAPPrimary = Template.bind({});
ColorIAPPrimary.args = {
  children: "IAP Primary Dialog",
  color: "ia-primary",
};

export const ColorIAPSecondary = Template.bind({});
ColorIAPSecondary.args = {
  children: "IAP Secondary Dialog",
  color: "ia-secondary",
};
