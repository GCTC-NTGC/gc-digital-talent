import { StoryFn } from "@storybook/react";

import { allModes } from "@gc-digital-talent/storybook-helpers";

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
  parameters: {
    defaultPath: {
      path: "/:index",
      initialEntries: [`/one`],
    },
    chromatic: {
      modes: {
        light: allModes.light,
        "light mobile": allModes["light mobile"],
        dark: allModes.dark,
      },
    },
  },
};

const Template: StoryFn<typeof AdminHero> = (args) => <AdminHero {...args} />;

export const Default = Template.bind({});
Default.args = {
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
