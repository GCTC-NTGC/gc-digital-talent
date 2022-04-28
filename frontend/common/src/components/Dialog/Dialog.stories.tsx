import React from "react";
import { Story, Meta } from "@storybook/react";
import DialogComponent from "./Dialog";

import Button from "../Button";

export default {
  component: DialogComponent,
  title: "Components/Dialog",
  args: {
    title: "Dialog",
  },
  argTypes: {
    title: {
      name: "title",
      type: { name: "string", required: true },
      control: {
        type: "text",
      },
    },
    subtitle: {
      name: "subtitle",
      type: { name: "string", required: false },
      control: {
        type: "text",
      },
    },
    content: {
      name: "content",
      type: { name: "string", required: false },
      control: {
        type: "text",
      },
    },
    confirmation: {
      name: "confirmation",
      type: { name: "boolean", required: false },
    },
    color: {
      options: ["ts-primary", "ia-primary", "ia-secondary"],
    },
  },
} as Meta;

const TemplateDialog: Story = (args) => {
  const [isOpen, setOpen] = React.useState<boolean>(false);

  const handleDismiss = () => {
    setOpen(false);
  };

  const { title, subtitle, content, confirmation, footer, color } = args;

  return (
    <>
      <Button color="primary" mode="solid" onClick={() => setOpen(true)}>
        Open Dialog
      </Button>
      <DialogComponent
        onDismiss={handleDismiss}
        isOpen={isOpen}
        title={title}
        subtitle={subtitle}
        confirmation={confirmation}
        footer={footer}
        color={color}
      >
        <p>{content}</p>
      </DialogComponent>
    </>
  );
};

export const BasicDialog = TemplateDialog.bind({});
export const DialogWithSubtitle = TemplateDialog.bind({});
export const DialogLongContent = TemplateDialog.bind({});
export const ConfirmationDialog = TemplateDialog.bind({});
export const ConfirmationDialogWithSubtitle = TemplateDialog.bind({});
export const DialogWithFooter = TemplateDialog.bind({});
export const IAPrimaryDialog = TemplateDialog.bind({});
export const IASecondaryDialog = TemplateDialog.bind({});

BasicDialog.args = {
  title: "Basic Dialog",
  subtitle: null,
  content:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam efficitur leo a tellus imperdiet, quis imperdiet nulla viverra. Aliquam porttitor pellentesque rhoncus. ",
};

DialogWithSubtitle.args = {
  title: "Dialog with Subtitle",
  subtitle: "Dialog Subtitle",
  content:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam efficitur leo a tellus imperdiet, quis imperdiet nulla viverra. Aliquam porttitor pellentesque rhoncus. ",
};

DialogLongContent.args = {
  title: "Dialog with Long Content",
  subtitle: null,
  content:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce ultricies dolor ut elit tristique, quis vehicula justo imperdiet. Nunc quis luctus risus. Morbi volutpat commodo dapibus. Ut vulputate massa sed fringilla sollicitudin. Nulla at scelerisque felis. In hac habitasse platea dictumst. Sed laoreet hendrerit dui, sit amet ultrices risus elementum et. Pellentesque facilisis eget ligula vitae mollis. Cras vestibulum justo a aliquet lobortis. Donec mi nisl, placerat vel erat et, cursus faucibus ante. Phasellus auctor lectus sit amet ipsum dictum, ullamcorper aliquam nisl elementum. Sed condimentum, ex nec posuere pharetra, tortor erat gravida arcu, vel blandit massa mauris eget eros. Fusce ac lorem suscipit, dignissim velit at, varius nibh. Donec sodales purus sed mauris congue gravida in tincidunt nisl. Mauris porta ac eros in lacinia. Duis finibus libero vel felis porta, non condimentum diam auctor. Cras faucibus augue id massa volutpat facilisis. Suspendisse quis pulvinar arcu, ut iaculis magna. In hac habitasse platea dictumst. Quisque eget risus elit. Suspendisse vitae augue velit. Nulla lobortis felis velit. Cras non rhoncus tortor, at elementum velit. Proin nec vehicula neque. Cras ac posuere tellus. Praesent laoreet sem facilisis, volutpat dolor eget, blandit eros. Nulla facilisi. Proin lacinia, velit id fermentum tempor, elit augue elementum lectus, sed cursus dolor risus rutrum felis. Cras suscipit, lorem nec lobortis tristique, eros tellus finibus urna, nec posuere tellus dolor et nibh. Quisque semper, lectus ut porttitor lobortis, lacus sem egestas erat, ac porta velit mauris molestie turpis. Nulla ac efficitur nulla. Donec consectetur nisl in ante hendrerit, eget suscipit sem cursus. Nam sed posuere urna, in dignissim dolor. Aliquam sed est blandit lacus dignissim blandit. Interdum et malesuada fames ac ante ipsum primis in faucibus. Nulla vel justo malesuada, vehicula massa non, fermentum nunc. Nullam non gravida elit. Curabitur a ligula semper nisl iaculis bibendum. Suspendisse posuere dui id pharetra placerat. Morbi leo lacus, facilisis ut malesuada tempor, vulputate in massa. Curabitur aliquet lacus nec congue congue. Aenean auctor id neque vel varius. Maecenas tincidunt magna at nisi congue, eget tempus nulla ultrices. Curabitur egestas ornare auctor. Etiam sagittis, leo sed venenatis gravida, velit sem maximus lacus, quis tempor elit diam vel tellus. Duis nec tempor turpis. Aenean quis orci vitae libero pulvinar malesuada. Phasellus interdum metus nibh, sed maximus purus porta ut. Ut ut tellus id leo efficitur pretium ut egestas arcu. Nunc imperdiet eu nibh sed tempor. Morbi at vehicula neque. Sed condimentum in neque a volutpat.",
};

ConfirmationDialog.args = {
  title: "Confirmation Dialog",
  subtitle: null,
  confirmation: true,
  content:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam efficitur leo a tellus imperdiet, quis imperdiet nulla viverra. Aliquam porttitor pellentesque rhoncus. ",
};

ConfirmationDialogWithSubtitle.args = {
  title: "Confirmation Dialog",
  subtitle: "Dialog Subtitle",
  confirmation: true,
  content:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam efficitur leo a tellus imperdiet, quis imperdiet nulla viverra. Aliquam porttitor pellentesque rhoncus. ",
};

IAPrimaryDialog.args = {
  title: "IA Primary Dialog",
  subtitle: "Dialog Subtitle",
  color: "ia-primary",
  content:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam efficitur leo a tellus imperdiet, quis imperdiet nulla viverra. Aliquam porttitor pellentesque rhoncus. ",
};

IASecondaryDialog.args = {
  title: "IA Secondary Dialog",
  subtitle: "Dialog Subtitle",
  color: "ia-secondary",
  content:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam efficitur leo a tellus imperdiet, quis imperdiet nulla viverra. Aliquam porttitor pellentesque rhoncus. ",
};

DialogWithFooter.args = {
  title: "Confirmation Dialog",
  subtitle: "Dialog Subtitle",
  content:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam efficitur leo a tellus imperdiet, quis imperdiet nulla viverra. Aliquam porttitor pellentesque rhoncus. ",
  footer: (
    <Button color="primary" mode="outline">
      Footer Button
    </Button>
  ),
};
