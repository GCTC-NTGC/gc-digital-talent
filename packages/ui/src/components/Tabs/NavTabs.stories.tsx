import React from "react";
import type { StoryFn } from "@storybook/react";

import NavTabs from "./NavTabs";

export default {
  component: NavTabs.Root,
  title: "Components/Nav Tabs",
};

const themes: Array<string> = ["light", "dark"];

const Template: StoryFn<typeof NavTabs.Root> = (args) => (
  <div>
    {themes.map((theme) => (
      <div key={theme} data-h2={theme}>
        <div
          data-h2-background="base(background)"
          data-h2-padding="base(x1 0)"
          data-h2-max-width="base(100%)"
        >
          <NavTabs.Root {...args} aria-label={`${theme} sub nav`}>
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
        </div>
      </div>
    ))}
  </div>
);

export const Default = Template.bind({});
Default.parameters = {
  defaultPath: {
    path: "/:index",
    initialEntries: [`/one`],
  },
};
