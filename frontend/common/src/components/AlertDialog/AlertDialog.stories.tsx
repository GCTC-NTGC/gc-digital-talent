import React from "react";
import { Story, Meta } from "@storybook/react";
import AlertDialogComponent from ".";

import Button from "../Button";

export default {
  component: AlertDialogComponent.Content,
  title: "Components/Alert Dialog",
} as Meta;

const Template: Story = () => {
  const leastDestructiveRef = React.useRef(null);
  const [isOpen, setOpen] = React.useState<boolean>(true);

  const open = () => {
    setOpen(true);
  };

  const close = () => {
    setOpen(false);
  };

  return (
    <>
      <Button color="primary" mode="solid" onClick={open}>
        Open Alert Dialog
      </Button>
      {isOpen && (
        <AlertDialogComponent.Overlay leastDestructiveRef={leastDestructiveRef}>
          <AlertDialogComponent.Content>
            <AlertDialogComponent.Heading onDismiss={close}>
              Alert Dialog
            </AlertDialogComponent.Heading>
            <AlertDialogComponent.Description>
              Integer nec sem vel quam lacinia dignissim eget in turpis. Nam
              volutpat, neque sed finibus volutpat, velit velit dignissim enim,
              sed condimentum quam leo ac purus.
            </AlertDialogComponent.Description>
            <AlertDialogComponent.Actions>
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
            </AlertDialogComponent.Actions>
          </AlertDialogComponent.Content>
        </AlertDialogComponent.Overlay>
      )}
    </>
  );
};

export const AlertDialog = Template.bind({});
