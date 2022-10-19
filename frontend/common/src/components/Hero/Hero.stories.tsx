import React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { imageUrl } from "../../helpers/router";
import Hero from "./Hero";

export default {
  component: Hero,
  title: "Components/Hero",
  args: {
    title: "Hero",
    subtitle: "Subtitle",
    imgPath: "https://via.placeholder.com/500",
    crumbs: [
      {
        label: "Home",
        url: "#",
      },
      {
        label: "One",
        url: "#",
      },
      {
        label: "Two",
        url: "#",
      },
      {
        label: "Three",
        url: "#",
      },
    ],
  },
} as ComponentMeta<typeof Hero>;

const Template: ComponentStory<typeof Hero> = (args) => <Hero {...args} />;

export const Default = Template.bind({});
