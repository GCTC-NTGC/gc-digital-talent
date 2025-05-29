import { StoryFn, Meta } from "@storybook/react";
import UserPlusIcon from "@heroicons/react/24/solid/UserPlusIcon";
import AcademicCapIcon from "@heroicons/react/24/solid/AcademicCapIcon";
import ChatBubbleBottomCenterIcon from "@heroicons/react/20/solid/ChatBubbleBottomCenterIcon";

import { allModes } from "@gc-digital-talent/storybook-helpers";

import browseHeroImg from "~/assets/img/browse_header.webp";

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
    defaultPath: {
      path: "/:index",
      initialEntries: [`/one`],
    },
  },
} as Meta<typeof Hero>;

export const ButtonsAndTabs = {
  args: {
    buttonLinks: [
      { icon: UserPlusIcon, text: "Hello", url: "#one", color: "quinary" },
      {
        icon: AcademicCapIcon,
        text: "Hello hello",
        url: "#two",
        color: "primary",
      },
      {
        icon: ChatBubbleBottomCenterIcon,
        text: "And goodbye",
        url: "#two",
        color: "tertiary",
      },
    ],
    navTabs: [
      { url: "/one", label: "Tab One" },
      { url: "/two", label: "Tab Two" },
      { url: "/three", label: "Tab Three" },
      { url: "/four", label: "Tab Four" },
      { url: "/five", label: "Tab Five" },
    ],
  },
};

export const Buttons = {
  args: {
    buttonLinks: [
      {
        icon: UserPlusIcon,
        text: "Hello",
        url: "#one",
        color: "secondary",
      },
      {
        icon: AcademicCapIcon,
        text: "Hello hello",
        url: "#two",
        color: "warning",
      },
      {
        icon: ChatBubbleBottomCenterIcon,
        text: "And goodbye",
        url: "#two",
        color: "error",
      },
    ],
  },
};

export const Tabs = {
  args: {
    navTabs: [
      { url: "/one", label: "Tab One" },
      { url: "/two", label: "Tab Two" },
      { url: "/three", label: "Tab Three" },
      { url: "/four", label: "Tab Four" },
      { url: "/five", label: "Tab Five" },
    ],
  },
};

export const NeitherButtonsOrTabs = {
  args: {},
};

export const ButtonsAndTabsWithCentering = {
  args: {
    buttonLinks: [
      { icon: UserPlusIcon, text: "Hello", url: "#one", color: "primary" },
      {
        icon: AcademicCapIcon,
        text: "Hello hello",
        url: "#two",
        color: "secondary",
      },
      {
        icon: ChatBubbleBottomCenterIcon,
        text: "And goodbye",
        url: "#two",
        color: "tertiary",
      },
    ],
    navTabs: [
      { url: "/one", label: "Tab One" },
      { url: "/two", label: "Tab Two" },
      { url: "/three", label: "Tab Three" },
      { url: "/four", label: "Tab Four" },
      { url: "/five", label: "Tab Five" },
    ],
    centered: true,
  },
};

export const ImageProvided = {
  args: {
    imgPath: browseHeroImg,
  },
};

export const ImageProvidedWithCentering = {
  args: {
    imgPath: browseHeroImg,
    centered: true,
  },
};

// overlap story
const TemplateWithContent: StoryFn<typeof Hero> = (args) => (
  <>
    <Hero {...args} />
  </>
);

export const OverlapWithContent = {
  render: TemplateWithContent,

  args: {
    overlap: true,
    children: (
      <div
        data-h2-wrapper="base(center, large, x1) p-tablet(center, large, x2)"
        data-h2-background-color="base(foreground)"
        data-h2-radius="base(rounded)"
        data-h2-padding="base(x2, x1)"
        data-h2-shadow="base(s)"
        data-h2-height="base(30vh)"
      >
        <p data-h2-font-size="base(h4)" data-h2-text-align="base(center)">
          Replace Me
        </p>
      </div>
    ),
  },
};
