import type { StoryFn, Meta } from "@storybook/react";
import { faker } from "@faker-js/faker/locale/en";

import {
  OverlayOrDialogDecorator,
  allModes,
} from "@gc-digital-talent/storybook-helpers";

import Button from "../Button";
import Dialog from "./Dialog";

faker.seed(0);

export default {
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
} as Meta<typeof Dialog.Root>;

const Template: StoryFn<typeof Dialog.Root> = () => (
  <Dialog.Root defaultOpen>
    <Dialog.Trigger>
      <Button>Open Dialog</Button>
    </Dialog.Trigger>
    <Dialog.Content hasSubtitle>
      <Dialog.Header subtitle="A dialog is a window overlaid on either the primary window or another dialog window.">
        Basic Dialog
      </Dialog.Header>
      <Dialog.Body>
        <p>{faker.lorem.sentences(3)}</p>
        <Dialog.Footer>
          <Dialog.Close>
            <Button color="secondary">Close</Button>
          </Dialog.Close>
        </Dialog.Footer>
      </Dialog.Body>
    </Dialog.Content>
  </Dialog.Root>
);

export const Default = {
  render: Template,
};
