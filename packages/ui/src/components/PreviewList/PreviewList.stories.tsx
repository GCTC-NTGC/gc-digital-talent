import { Meta, StoryFn } from "@storybook/react";
import { action } from "storybook/actions";
import { faker } from "@faker-js/faker";

import { allModes } from "@gc-digital-talent/storybook-helpers";

import PreviewList, { MetaDataProps } from "./PreviewList";

faker.seed(0);

const previewDetails: MetaDataProps[] = [
  {
    key: "it-chip-id",
    type: "chip",
    color: "secondary",
    children: "New",
  },
  { key: "it-text-id", type: "text", children: "IT-01" },
  {
    key: "it-text-2-id",
    type: "text",
    children: "Manager: Dale Monroe",
  },
  {
    key: "it-text-3-id",
    type: "text",
    children: (
      <span>
        Respond by:{" "}
        <span data-h2-color="base(error.darkest)">April 30th, 2024</span>
      </span>
    ),
  },
];

const previewDetailsTwo: MetaDataProps[] = [
  {
    key: "it-chip-id",
    type: "chip",
    color: "secondary",
    children: "Submitted",
  },
  { key: "it-text-id", type: "text", children: "56 potential matches" },
  {
    key: "it-text-2-id",
    type: "text",
    children: "Opened on: April 30th, 2024",
  },
];

const previewDetailsThree: MetaDataProps[] = [
  {
    key: "it-chip-id",
    type: "chip",
    color: "warning",
    children: "Awaiting response",
  },
  { key: "it-text-id", type: "text", children: "12 potential matches" },
  {
    key: "it-text-2-id",
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

export const Default = {
  render: Template,

  args: {
    children: (
      <>
        <PreviewList.Item
          title="IT-01: Junior application developer"
          metaData={previewDetails}
          action={
            <PreviewList.Button
              label="View preview button one"
              onClick={() => action("preview button one clicked")()}
            />
          }
        />
        <PreviewList.Item
          title="IT-02: Application developer"
          metaData={previewDetailsTwo}
          action={
            <PreviewList.Button
              label="View preview button two"
              onClick={() => action("preview button two clicked")()}
            />
          }
        />
        <PreviewList.Item
          title="IT-03: Database architect"
          metaData={previewDetailsThree}
          action={
            <PreviewList.Button
              label="View preview button three"
              onClick={() => action("preview button three clicked")()}
            />
          }
        />
      </>
    ),
  },
};

export const WithChildren = {
  render: Template,

  args: {
    children: (
      <PreviewList.Item
        title="IT-01: Junior application developer"
        metaData={previewDetails}
        action={
          <PreviewList.Button
            label="View preview button one"
            onClick={() => action("preview button one clicked")()}
          />
        }
      >
        <p>{faker.lorem.paragraph()}</p>
      </PreviewList.Item>
    ),
  },
};
