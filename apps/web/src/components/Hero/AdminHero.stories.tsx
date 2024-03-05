import React from "react";
import { StoryFn } from "@storybook/react";

import AdminHero from "./AdminHero";

const navItems = [
  {
    label: "Home",
    url: "/home",
  },
  {
    label: "One",
    url: "/one",
  },
  {
    label: "Two",
    url: "/two",
  },
  {
    label: "Three",
    url: "/three",
  },
];

export default {
  component: AdminHero,
  title: "Components/Hero/Admin",
  args: {
    title: "Hero",
  },
  parameters: {
    defaultPath: {
      path: "/:index",
      initialEntries: [`/one`],
    },
  },
};

const Template: StoryFn<typeof AdminHero> = (args) => (
  <>
    <div data-h2="light">
      <div
        data-h2-padding="base(x2)"
        data-h2-background-color="base(background)"
      >
        <AdminHero {...args} />
      </div>
    </div>
    <div data-h2="dark">
      <div
        data-h2-padding="base(x2)"
        data-h2-background-color="base(background)"
      >
        <AdminHero {...args} />
      </div>
    </div>
  </>
);

export const Default = Template.bind({});

export const Subtitle = Template.bind({});
Subtitle.args = {
  subtitle: "A subtitle for the current page.",
};

export const SubNav = Template.bind({});
SubNav.args = {
  nav: {
    mode: "subNav",
    items: navItems,
  },
};

export const Breadcrumbs = Template.bind({});
Breadcrumbs.args = {
  nav: {
    mode: "crumbs",
    items: navItems,
  },
};
