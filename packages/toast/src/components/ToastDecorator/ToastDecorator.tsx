import type { Decorator } from "@storybook/react-vite";

import Toast from "../Toast";

export const ToastDecorator: Decorator = (Story) => (
  <>
    {Story()}
    <Toast />
  </>
);

export default ToastDecorator;
