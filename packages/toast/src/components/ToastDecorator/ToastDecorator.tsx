import type { Decorator } from "@storybook/react-vite";

import Toast from "../Toast";

const ToastDecorator: Decorator = (Story) => (
  <>
    {Story()}
    <Toast />
  </>
);

export default ToastDecorator;
