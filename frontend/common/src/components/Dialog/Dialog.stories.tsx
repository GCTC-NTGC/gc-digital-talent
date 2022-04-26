import React from "react";
import { Story, Meta } from "@storybook/react";
import DialogComponent from "./Dialog";

import Button from "../Button";

export default {
  component: DialogComponent,
  title: "Components/Dialog",
} as Meta;

const TemplateDialog: Story = (args) => {
  const [isOpen, setOpen] = React.useState<boolean>(false);

  const handleDismiss = () => {
    setOpen(false);
  };

  const { content } = args;

  return (
    <>
      <Button color="primary" mode="solid" onClick={() => setOpen(true)}>
        Open Dialog
      </Button>
      <DialogComponent onDismiss={handleDismiss} isOpen={isOpen}>
        <p>{content}</p>
      </DialogComponent>
    </>
  );
};

export const Dialog = TemplateDialog.bind({});

Dialog.args = {
  content:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam efficitur leo a tellus imperdiet, quis imperdiet nulla viverra. Aliquam porttitor pellentesque rhoncus. ",
};
