import { Meta, StoryFn } from "@storybook/react-vite";

import SupportPage from "./SupportPage";

export default {
  component: SupportPage,
} as Meta<typeof SupportPage>;

const Template: StoryFn<typeof SupportPage> = () => {
  return <SupportPage />;
};

export const Default = Template.bind({});
