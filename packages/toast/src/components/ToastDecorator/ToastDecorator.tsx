import { StoryFn } from "@storybook/react-vite";

import Toast from "../Toast";

const ToastDecorator = (Story: StoryFn) => (
  <>
    <Story />
    <Toast />
  </>
);

export default ToastDecorator;
