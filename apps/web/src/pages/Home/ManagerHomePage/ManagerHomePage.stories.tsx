import { StoryFn } from "@storybook/react-vite";

import { CHROMATIC_VIEWPORTS } from "@gc-digital-talent/storybook-helpers";

import ManagerHomePage from "./ManagerHomePage";

export default {
  component: ManagerHomePage,
};

const Template: StoryFn = () => <ManagerHomePage />;

export const Default = Template.bind({});
Default.parameters = {
  chromatic: { viewports: CHROMATIC_VIEWPORTS },
};
