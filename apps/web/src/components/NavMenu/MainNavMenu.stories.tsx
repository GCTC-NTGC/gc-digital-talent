import type { StoryFn } from "@storybook/react";

import { allModes } from "@gc-digital-talent/storybook-helpers";

import MainNavMenu from "./MainNavMenu";

export default {
  component: MainNavMenu,
  parameters: {
    defaultPath: {
      path: "/:index",
      initialEntries: [`/one`],
    },
    chromatic: {
      modes: {
        light: allModes.light,
        dark: allModes.dark,
      },
    },
  },
};

const Template: StoryFn<typeof MainNavMenu> = () => (
  <div className="relative h-screen w-full">
    <MainNavMenu />
  </div>
);

export const Default = Template.bind({});
