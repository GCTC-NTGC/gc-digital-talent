import { Meta, StoryFn } from "@storybook/react";
import { faker } from "@faker-js/faker";

import { allModes } from "@gc-digital-talent/storybook-helpers";

import PreviewList, { Detail } from "./PreviewList";

const previewDetails: Detail[] = [
  {
    type: "chip",
    color: "secondary",
    value: "New",
  },
  { type: "text", value: "IT-01" },
  {
    type: "text",
    value: `Manager: ${faker.person.firstName()} ${faker.person.lastName()}`,
  },
  {
    type: "text",
    value: (
      <span>
        Respond by: <span data-h2-color="base(error)">April 30th, 2024</span>
      </span>
    ),
  },
];

const previewDetailsTwo: Detail[] = [
  {
    type: "chip",
    color: "secondary",
    value: "Submitted",
  },
  { type: "text", value: "56 potential matches" },
  {
    type: "text",
    value: "Opened on: April 30th, 2024",
  },
];

const previewDetailsThree: Detail[] = [
  {
    type: "chip",
    color: "warning",
    value: "Awaiting response",
  },
  { type: "text", value: "12 potential matches" },
  {
    type: "text",
    value: "Opened on: April 30th, 2024",
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
