import type { ComponentPropsWithoutRef } from "react";
import type { StoryObj, Meta } from "@storybook/react-vite";
import { faker } from "@faker-js/faker/locale/en";

import {
  OverlayOrDialogDecorator,
  allModes,
} from "@gc-digital-talent/storybook-helpers";

import Button from "../Button";
import Dialog from "./Dialog";

faker.seed(0);

interface DialogArgs extends ComponentPropsWithoutRef<typeof Dialog.Root> {
  title: string;
}

const meta = {
  component: Dialog.Root,
  decorators: [OverlayOrDialogDecorator],
  parameters: {
    chromatic: {
      modes: {
        light: allModes.light,
        dark: allModes.dark,
      },
    },
  },
  args: {
    title: "Basic dialog",
  },
  argTypes: {
    title: { control: "text" },
  },
  render: (args) => (
    <Dialog.Root defaultOpen>
      <Dialog.Trigger>
        <Button>Open Dialog</Button>
      </Dialog.Trigger>
      <Dialog.Content hasSubtitle>
        <Dialog.Header subtitle="A dialog is a window overlaid on either the primary window or another dialog window.">
          {args.title}
        </Dialog.Header>
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
  ),
} satisfies Meta<DialogArgs>;

export default meta;

type Story = StoryObj<DialogArgs>;

export const Default: Story = {};

export const WithLongTitle: Story = {
  args: {
    title: "Basic dialog that is actually a very long and descriptive sentence",
  },
};
