import { StoryFn, Meta } from "@storybook/react";

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
      {
        label: "Three",
        url: "#three",
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

export const Default = Template.bind({});

export const Overlap = Template.bind({});
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
