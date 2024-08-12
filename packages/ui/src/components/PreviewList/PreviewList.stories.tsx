import { Meta, StoryFn } from "@storybook/react";
import { faker } from "@faker-js/faker";

import { allModes } from "@gc-digital-talent/storybook-helpers";

import PreviewList, { DetailProps } from "./PreviewList";

const previewDetails: DetailProps[] = [
  {
    type: "chip",
    color: "secondary",
    children: "New",
  },
  { type: "text", children: "IT-01" },
  {
    type: "text",
    children: `Manager: ${faker.person.firstName()} ${faker.person.lastName()}`,
  },
  {
    type: "text",
    children: (
      <span>
        Respond by:{" "}
        <span data-h2-color="base(error.darkest)">April 30th, 2024</span>
      </span>
    ),
  },
];

const previewDetailsTwo: DetailProps[] = [
  {
    type: "chip",
    color: "secondary",
    children: "Submitted",
  },
  { type: "text", children: "56 potential matches" },
  {
    type: "text",
    children: "Opened on: April 30th, 2024",
  },
];

const previewDetailsThree: DetailProps[] = [
  {
    type: "chip",
    color: "warning",
    children: "Awaiting response",
  },
  { type: "text", children: "12 potential matches" },
  {
    type: "text",
    children: "Opened on: April 30th, 2024",
  },
];

export default {
  component: PreviewList.Root,
  parameters: {
    chromatic: {
      modes: {
        light: allModes.light,
        "light mobile": allModes["light mobile"],
        dark: allModes.dark,
      },
    },
  },
} as Meta<typeof PreviewList.Root>;

const Template: StoryFn<typeof PreviewList.Root> = (args) => {
  const { children } = args;

  return <PreviewList.Root>{children}</PreviewList.Root>;
};

export const Default = Template.bind({});
Default.args = {
  children: (
    <>
      <PreviewList.Item
        title="IT-01: Junior application developer"
        details={previewDetails}
        buttonName="View preview button one"
      />
      <PreviewList.Item
        title="IT-02: Application developer"
        details={previewDetailsTwo}
        buttonName="View preview button two"
      />
      <PreviewList.Item
        title="IT-03: Database architect"
        details={previewDetailsThree}
        buttonName="View preview button three"
      />
    </>
  ),
};
