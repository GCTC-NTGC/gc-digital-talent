import React from "react";
import type { StoryFn, Meta } from "@storybook/react";
import { faker } from "@faker-js/faker";

import { OverlayOrDialogDecorator } from "@gc-digital-talent/storybook-helpers";

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
} as Meta<typeof Dialog.Header>;

type Args = React.ComponentProps<typeof Dialog.Header> & {
  theme: "dark" | "light";
};

const Template: StoryFn<Args> = (args) => {
  const [container, setContainer] = React.useState<HTMLElement | null>(null);
  const { children, subtitle, theme } = args;
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
      <div ref={setContainer} data-h2={theme} />
    </>
  );
};

export const BasicLight = Template.bind({});
BasicLight.args = {
  children: "Basic Dialog",
  theme: "light",
};

export const BasicDark = Template.bind({});
BasicDark.args = {
  children: "Basic Dialog",
  theme: "dark",
};

export const WithSubtitleLight = Template.bind({});
WithSubtitleLight.args = {
  children: "Basic Dialog",
  subtitle:
    "A dialog is a window overlaid on either the primary window or another dialog window.",
  theme: "light",
};

export const WithSubtitleDark = Template.bind({});
WithSubtitleDark.args = {
  children: "Basic Dialog",
  subtitle:
    "A dialog is a window overlaid on either the primary window or another dialog window.",
  theme: "dark",
};
