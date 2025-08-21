import type { Decorator } from "@storybook/react";

import Toast from "../Toast";

const ToastDecorator: Decorator = (Story) => (
  <>
    {Story()}
    <Toast />
  </>
);

export default ToastDecorator;
