import type { StoryFn, Meta } from "@storybook/react-vite";

import {
  OverlayOrDialogDecorator,
  allModes,
} from "@gc-digital-talent/storybook-helpers";

import Button from "../Button";
import AlertDialog from "./AlertDialog";

export default {
  component: AlertDialog.Root,
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
        An alert dialog is a modal dialog that interrupts the user&apos;s
        workflow to communicate an important message and acquire a response.
        Examples include action confirmation prompts and error message
        confirmations.
      </AlertDialog.Description>
      <AlertDialog.Footer>
        <AlertDialog.Action>
          <Button>Action</Button>
        </AlertDialog.Action>
        <AlertDialog.Cancel>
          <Button color="warning" mode="inline">
            Cancel
          </Button>
        </AlertDialog.Cancel>
      </AlertDialog.Footer>
    </AlertDialog.Content>
  </AlertDialog.Root>
);

export const Default = Template.bind({});
