import React from "react";
import { StoryFn, Meta } from "@storybook/react";

import Hero from "./Hero";

export default {
  component: Hero,
  title: "Components/Hero",
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
      {
        label: "Three",
        url: "#three",
      },
    ],
  },
} as Meta<typeof Hero>;

const heroContent = {
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
    {
      label: "Three",
      url: "#three",
    },
  ],
};

const StandardStory: StoryFn = (args) => (
  <>
    <div data-h2="light">
      <div
        data-h2-padding="base(x2)"
        data-h2-background-color="base(background)"
      >
        <Hero {...heroContent} {...args} />
      </div>
    </div>
    <div data-h2="dark">
      <div
        data-h2-padding="base(x2)"
        data-h2-background-color="base(background)"
      >
        <Hero {...heroContent} {...args} />
      </div>
    </div>
    <div data-h2="iap light">
      <div
        data-h2-padding="base(x2)"
        data-h2-background-color="base(background)"
      >
        <Hero {...heroContent} {...args} />
      </div>
    </div>
    <div data-h2="iap dark">
      <div
        data-h2-padding="base(x2)"
        data-h2-background-color="base(background)"
      >
        <Hero {...heroContent} {...args} />
      </div>
    </div>
  </>
);

export const Standard = StandardStory.bind({});

export const WithImage = StandardStory.bind({});
WithImage.args = {
  imgPath: "https://via.placeholder.com/500",
};

export const NoSubtitle = StandardStory.bind({});
NoSubtitle.args = {
  subtitle: undefined,
};

export const Centered = StandardStory.bind({});
Centered.args = {
  centered: true,
};

export const Overlap = StandardStory.bind({});
Overlap.args = {
  centered: true,
  children: (
    <div
      data-h2-background-color="base(white)"
      data-h2-radius="base(rounded)"
      data-h2-padding="base(x2, x1)"
      data-h2-shadow="base(s)"
      data-h2-text-align="base(center)"
    >
      <p data-h2-font-size="base(h4)">Replace Me</p>
    </div>
  ),
};
