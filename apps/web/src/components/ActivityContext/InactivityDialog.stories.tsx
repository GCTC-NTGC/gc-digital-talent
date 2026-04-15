import type { StoryFn, Meta } from "@storybook/react-vite";
import { action } from "storybook/actions";

import {
  OverlayOrDialogDecorator,
  allModes,
} from "@gc-digital-talent/storybook-helpers";

import InactivityDialog from "./InactivityDialog";

export default {
  component: InactivityDialog,
  decorators: [OverlayOrDialogDecorator],
  parameters: {
    chromatic: {
      modes: {
        light: allModes.light,
        dark: allModes.dark,
      },
    },
  },
} as Meta<typeof InactivityDialog>;

const Template: StoryFn<typeof InactivityDialog> = () => (
  <InactivityDialog
    open={true}
    onOpenChange={action("onOpenChange")}
    remainingMinutes={5}
  />
);

export const Default = Template.bind({});
