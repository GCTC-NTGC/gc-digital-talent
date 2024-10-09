import { StoryFn, Meta } from "@storybook/react";
import UserPlusIcon from "@heroicons/react/24/solid/UserPlusIcon";
import AcademicCapIcon from "@heroicons/react/24/solid/AcademicCapIcon";
import ChatBubbleBottomCenterIcon from "@heroicons/react/20/solid/ChatBubbleBottomCenterIcon";

import { allModes } from "@gc-digital-talent/storybook-helpers";

import Hero from "./Hero";

export default {
  component: Hero,
  args: {
    title: "Hero",
    subtitle: "Subtitle",
    crumbs: [
      {
        label: "Home",
        url: "#home",
      },
      {
        label: "One",
        url: "#one",
      },
      {
        label: "Two",
        url: "#two",
      },
    ],
  },
  parameters: {
    chromatic: {
      modes: {
        light: allModes.light,
        "light mobile": allModes["light mobile"],
        dark: allModes.dark,
        "light iap": allModes["light iap desktop"],
        "dark iap": allModes["dark iap desktop"],
      },
    },
  },
} as Meta<typeof Hero>;

const Template: StoryFn<typeof Hero> = (args) => <Hero {...args} />;

export const ButtonsAndTabs = Template.bind({});
ButtonsAndTabs.args = {
  buttonLinks: [
    { icon: UserPlusIcon, text: "Hello", url: "#one" },
    { icon: AcademicCapIcon, text: "Hello hello", url: "#two" },
    { icon: ChatBubbleBottomCenterIcon, text: "And goodbye", url: "#two" },
  ],
  navTabs: [
    { url: "#one", label: "One" },
    { url: "#two", label: "Two" },
    { url: "#three", label: "Three" },
  ],
};

export const Buttons = Template.bind({});
Buttons.args = {
  buttonLinks: [
    { icon: UserPlusIcon, text: "Hello", url: "#one" },
    { icon: AcademicCapIcon, text: "Hello hello", url: "#two" },
    { icon: ChatBubbleBottomCenterIcon, text: "And goodbye", url: "#two" },
  ],
};

export const Tabs = Template.bind({});
Tabs.args = {
  navTabs: [
    { url: "#one", label: "One" },
    { url: "#two", label: "Two" },
    { url: "#three", label: "Three" },
  ],
};

export const NeitherButtonsOrTabs = Template.bind({});
NeitherButtonsOrTabs.args = {};

export const Overlap = Template.bind({});
Overlap.args = {
  overlap: true,
};

export const ButtonsAndTabsWithCentering = Template.bind({});
ButtonsAndTabsWithCentering.args = {
  buttonLinks: [
    { icon: UserPlusIcon, text: "Hello", url: "#one" },
    { icon: AcademicCapIcon, text: "Hello hello", url: "#two" },
    { icon: ChatBubbleBottomCenterIcon, text: "And goodbye", url: "#two" },
  ],
  navTabs: [
    { url: "#one", label: "One" },
    { url: "#two", label: "Two" },
    { url: "#three", label: "Three" },
  ],
  centered: true,
};
