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
  <div
    data-h2-position="base(relative)"
    data-h2-width="base(90vw) l-tablet(97vw)"
    data-h2-height="base(95vh)"
  >
    <MainNavMenu />
  </div>
);

export const Default = {
  render: Template,
};
