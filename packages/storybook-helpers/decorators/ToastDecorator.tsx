import { StoryFn } from "@storybook/react";

import Toast from "@gc-digital-talent/toast";

const ToastDecorator = (Story: StoryFn) => (
  <>
    <Story />
    <Toast />
  </>
);

export default ToastDecorator;
