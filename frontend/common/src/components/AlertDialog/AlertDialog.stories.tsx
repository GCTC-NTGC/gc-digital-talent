import React from "react";
import { Story, Meta } from "@storybook/react";
import AlertDialog from "./AlertDialog";
import type { AlertDialogProps } from "./AlertDialog";

import Button from "../Button";

export default {
  component: AlertDialog,
  title: "Components/Alert Dialog",
  args: {
    title: "Alert Dialog",
    description: null,
  },
  argTypes: {
    title: {
      name: "title",
      type: { name: "string", required: true },
      control: {
        type: "text",
      },
    },
    description: {
      name: "description",
      type: { name: "string", required: false },
      control: {
        type: "text",
      },
    },
  },
} as Meta;

interface StoryArgs {
  title: AlertDialogProps["title"];
  description?: string;
}

const Template: Story<StoryArgs> = (args) => {
  const leastDestructiveRef = React.useRef(null);
  const [isOpen, setOpen] = React.useState<boolean>(true);

  const { title, description } = args;

  const open = () => {
    setOpen(true);
  };

  const close = () => {
    setOpen(false);
  };

  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <Button color="primary" mode="solid" onClick={open}>
        Open Alert Dialog
      </Button>
      {isOpen && (
        <AlertDialog
          isOpen={isOpen}
          onDismiss={close}
          title={title}
          leastDestructiveRef={leastDestructiveRef}
        >
          {description && (
            <AlertDialog.Description>{description}</AlertDialog.Description>
          )}
          <AlertDialog.Actions>
            <Button
              mode="outline"
              color="black"
              ref={leastDestructiveRef}
              onClick={close}
            >
              Cancel
            </Button>
            <div data-h2-margin="b(left, s)">
              <Button mode="solid" color="primary" onClick={close}>
                Confirm
              </Button>
            </div>
          </AlertDialog.Actions>
        </AlertDialog>
      )}
    </div>
  );
};

export const BasicAlertDialog = Template.bind({});
export const DescriptionAlertDialog = Template.bind({});

DescriptionAlertDialog.args = {
  title: "Description Alert Dialog",
  description: "Are you sure you would like to read this alert?",
};
