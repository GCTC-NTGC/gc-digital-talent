import type { StoryFn } from "@storybook/react";

import { allModes } from "@gc-digital-talent/storybook-helpers";

import NavMenu from "./NavMenu";
import SiteNavMenu from "./SiteNavMenu";

export default {
  component: NavMenu.Root,
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

const Template: StoryFn<typeof NavMenu.Root> = () => (
  <div
    data-h2-position="base(relative)"
    data-h2-width="base(90vw) l-tablet(97vw)"
    data-h2-height="base(95vh)"
  >
    <SiteNavMenu />
  </div>
);

export const Default = Template.bind({});
