import { StoryFn, Meta } from "@storybook/react";
import UserPlusIcon from "@heroicons/react/24/solid/UserPlusIcon";
import AcademicCapIcon from "@heroicons/react/24/solid/AcademicCapIcon";
import ChatBubbleBottomCenterIcon from "@heroicons/react/20/solid/ChatBubbleBottomCenterIcon";

import { allModes } from "@gc-digital-talent/storybook-helpers";

import HeroUpdated from "./HeroUpdated";

export default {
  component: HeroUpdated,
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
} as Meta<typeof HeroUpdated>;

const Template: StoryFn<typeof HeroUpdated> = (args) => (
  <HeroUpdated {...args} />
);

export const Default = Template.bind({});
Default.args = {
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
