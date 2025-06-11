import { StoryFn } from "@storybook/react-vite";

import Context from "./Context";

export default {
  component: Context,
};

export const Default = {
  args: {
    children: "This is a description",
  },
};
