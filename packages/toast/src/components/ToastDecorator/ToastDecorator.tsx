import { StoryFn } from "@storybook/react";

import Toast from "../Toast";

const ToastDecorator = (Story: StoryFn) => (
  <>
    <Story />
    <Toast />
  </>
);

export default ToastDecorator;
