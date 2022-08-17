import React from "react";
import type { SyntheticEvent } from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import type { HandlerFunction } from "@storybook/addon-actions";
import Dialog from "./Dialog";
import OverlayOrDialogDecorator from "../../../.storybook/decorators/OverlayOrDialogDecorator";

import Button from "../Button";

export default {
  component: Dialog,
  title: "Components/Dialog",
  decorators: [OverlayOrDialogDecorator],
  argTypes: {
    // Disabled because controlled and overridden anyhow.
    isOpen: { control: { disable: true } },
    children: { control: { disable: true } },
  },
} as ComponentMeta<typeof Dialog>;

const TemplateDialog: ComponentStory<typeof Dialog> = (args) => {
  const [isOpen, setOpen] = React.useState<boolean>(true);

  const handleDismiss = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  return (
    <>
      <Button color="primary" mode="solid" onClick={handleOpen}>
        Open Dialog
      </Button>
      <Dialog {...args} {...{ isOpen }} onDismiss={handleDismiss} />
    </>
  );
};

export const Basic = TemplateDialog.bind({});
export const WithSubtitle = TemplateDialog.bind({});
export const LongContent = TemplateDialog.bind({});
export const ConfirmationType = TemplateDialog.bind({});
export const ConfirmationTypeWithSubtitle = TemplateDialog.bind({});
export const WithFooter = TemplateDialog.bind({});
export const WithForm = TemplateDialog.bind({});
export const ColorPrimary = TemplateDialog.bind({});
export const ColorSecondary = TemplateDialog.bind({});
export const ColorIAPrimary = TemplateDialog.bind({});
export const ColorIASecondary = TemplateDialog.bind({});

Basic.args = {
  title: "Basic Dialog",
  subtitle: undefined,
  children:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam efficitur leo a tellus imperdiet, quis imperdiet nulla viverra. Aliquam porttitor pellentesque rhoncus. ",
};

WithSubtitle.args = {
  title: "Dialog with Subtitle",
  subtitle: "Dialog Subtitle",
  children:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam efficitur leo a tellus imperdiet, quis imperdiet nulla viverra. Aliquam porttitor pellentesque rhoncus. ",
};

LongContent.args = {
  title: "Dialog with Long Content",
  subtitle: undefined,
  children:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce ultricies dolor ut elit tristique, quis vehicula justo imperdiet. Nunc quis luctus risus. Morbi volutpat commodo dapibus. Ut vulputate massa sed fringilla sollicitudin. Nulla at scelerisque felis. In hac habitasse platea dictumst. Sed laoreet hendrerit dui, sit amet ultrices risus elementum et. Pellentesque facilisis eget ligula vitae mollis. Cras vestibulum justo a aliquet lobortis. Donec mi nisl, placerat vel erat et, cursus faucibus ante. Phasellus auctor lectus sit amet ipsum dictum, ullamcorper aliquam nisl elementum. Sed condimentum, ex nec posuere pharetra, tortor erat gravida arcu, vel blandit massa mauris eget eros. Fusce ac lorem suscipit, dignissim velit at, varius nibh. Donec sodales purus sed mauris congue gravida in tincidunt nisl. Mauris porta ac eros in lacinia. Duis finibus libero vel felis porta, non condimentum diam auctor. Cras faucibus augue id massa volutpat facilisis. Suspendisse quis pulvinar arcu, ut iaculis magna. In hac habitasse platea dictumst. Quisque eget risus elit. Suspendisse vitae augue velit. Nulla lobortis felis velit. Cras non rhoncus tortor, at elementum velit. Proin nec vehicula neque. Cras ac posuere tellus. Praesent laoreet sem facilisis, volutpat dolor eget, blandit eros. Nulla facilisi. Proin lacinia, velit id fermentum tempor, elit augue elementum lectus, sed cursus dolor risus rutrum felis. Cras suscipit, lorem nec lobortis tristique, eros tellus finibus urna, nec posuere tellus dolor et nibh. Quisque semper, lectus ut porttitor lobortis, lacus sem egestas erat, ac porta velit mauris molestie turpis. Nulla ac efficitur nulla. Donec consectetur nisl in ante hendrerit, eget suscipit sem cursus. Nam sed posuere urna, in dignissim dolor. Aliquam sed est blandit lacus dignissim blandit. Interdum et malesuada fames ac ante ipsum primis in faucibus. Nulla vel justo malesuada, vehicula massa non, fermentum nunc. Nullam non gravida elit. Curabitur a ligula semper nisl iaculis bibendum. Suspendisse posuere dui id pharetra placerat. Morbi leo lacus, facilisis ut malesuada tempor, vulputate in massa. Curabitur aliquet lacus nec congue congue. Aenean auctor id neque vel varius. Maecenas tincidunt magna at nisi congue, eget tempus nulla ultrices. Curabitur egestas ornare auctor. Etiam sagittis, leo sed venenatis gravida, velit sem maximus lacus, quis tempor elit diam vel tellus. Duis nec tempor turpis. Aenean quis orci vitae libero pulvinar malesuada. Phasellus interdum metus nibh, sed maximus purus porta ut. Ut ut tellus id leo efficitur pretium ut egestas arcu. Nunc imperdiet eu nibh sed tempor. Morbi at vehicula neque. Sed condimentum in neque a volutpat.",
};

ConfirmationType.args = {
  title: "Confirmation Dialog",
  subtitle: undefined,
  confirmation: true,
  children:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam efficitur leo a tellus imperdiet, quis imperdiet nulla viverra. Aliquam porttitor pellentesque rhoncus. ",
};

ConfirmationTypeWithSubtitle.args = {
  title: "Confirmation Dialog",
  subtitle: "Dialog Subtitle",
  confirmation: true,
  children:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam efficitur leo a tellus imperdiet, quis imperdiet nulla viverra. Aliquam porttitor pellentesque rhoncus. ",
};

ColorPrimary.args = {
  title: "Primary Dialog",
  subtitle: "Dialog Subtitle",
  color: "ts-primary",
  children:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam efficitur leo a tellus imperdiet, quis imperdiet nulla viverra. Aliquam porttitor pellentesque rhoncus. ",
};

ColorSecondary.args = {
  title: "Secondary Dialog",
  subtitle: "Dialog Subtitle",
  color: "ts-secondary",
  children:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam efficitur leo a tellus imperdiet, quis imperdiet nulla viverra. Aliquam porttitor pellentesque rhoncus. ",
};

ColorIAPrimary.args = {
  title: "IA Primary Dialog",
  subtitle: "Dialog Subtitle",
  color: "ia-primary",
  children:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam efficitur leo a tellus imperdiet, quis imperdiet nulla viverra. Aliquam porttitor pellentesque rhoncus. ",
};

ColorIASecondary.args = {
  title: "IA Secondary Dialog",
  subtitle: "Dialog Subtitle",
  color: "ia-secondary",
  children:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam efficitur leo a tellus imperdiet, quis imperdiet nulla viverra. Aliquam porttitor pellentesque rhoncus. ",
};

WithFooter.args = {
  title: "Confirmation Dialog",
  subtitle: "Dialog Subtitle",
  children: (
    <>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam efficitur
        leo a tellus imperdiet, quis imperdiet nulla viverra. Aliquam porttitor
        pellentesque rhoncus.
      </p>
      <Dialog.Footer>
        <Button
          color="primary"
          mode="outline"
          onClick={action("Perform action")}
        >
          Footer Button
        </Button>
      </Dialog.Footer>
    </>
  ),
};

// Prevents Storybook iframe from refreshing.
// See: https://github.com/storybookjs/storybook/issues/128#issuecomment-743974520
const withPreventDefault =
  (handler: HandlerFunction) => (e: SyntheticEvent) => {
    e.preventDefault();
    return handler(e);
  };

WithForm.args = {
  title: "Dialog with Form",
  children: (
    <form onSubmit={withPreventDefault(action("Submit form"))}>
      <input />
      <Dialog.Footer>
        <Button type="submit" color="primary" mode="solid">
          Submit Form
        </Button>
      </Dialog.Footer>
    </form>
  ),
};
