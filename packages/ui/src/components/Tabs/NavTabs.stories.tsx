import type { StoryFn } from "@storybook/react";

import { allModes } from "@gc-digital-talent/storybook-helpers";

import NavTabs from "./NavTabs";

export default {
  component: NavTabs.Root,
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

const Template: StoryFn<typeof NavTabs.Root> = (args) => (
  <NavTabs.Root {...args} aria-label="sub nav">
    <NavTabs.List>
      <NavTabs.Item>
        <NavTabs.Link href="/one">One</NavTabs.Link>
      </NavTabs.Item>
      <NavTabs.Item>
        <NavTabs.Link href="/two">Two</NavTabs.Link>
      </NavTabs.Item>
      <NavTabs.Item>
        <NavTabs.Link href="/three">Three</NavTabs.Link>
      </NavTabs.Item>
      <NavTabs.Item>
        <NavTabs.Link href="/four">Four</NavTabs.Link>
      </NavTabs.Item>
      <NavTabs.Item>
        <NavTabs.Link href="/five">Five</NavTabs.Link>
      </NavTabs.Item>
    </NavTabs.List>
  </NavTabs.Root>
);

export const Default = Template.bind({});
