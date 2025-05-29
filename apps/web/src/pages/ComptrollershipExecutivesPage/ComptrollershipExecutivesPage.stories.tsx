import { Meta, StoryFn } from "@storybook/react";

import { CHROMATIC_VIEWPORTS } from "@gc-digital-talent/storybook-helpers";

import ComptrollershipExecutivesPage from "./ComptrollershipExecutivesPage";

export default {
  component: ComptrollershipExecutivesPage,
} as Meta;

const Template: StoryFn<typeof ComptrollershipExecutivesPage> = () => (
  <ComptrollershipExecutivesPage />
);

export const Default = {
  render: Template,

  parameters: {
    chromatic: { viewports: CHROMATIC_VIEWPORTS },
  },
};
