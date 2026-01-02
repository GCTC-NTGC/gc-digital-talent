import { Meta, StoryFn } from "@storybook/react-vite";
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
        <span className="text-error-700 dark:text-error-100">
          April 30th, 2024
        </span>
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
    children: "Submitted: April 30th, 2024",
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
    children: "Submitted: April 30th, 2024",
  },
];

const experienceDetails: MetaDataProps[] = [
  {
    key: "type",
    type: "text",
    children: "Work experience",
  },
  {
    key: "duration",
    type: "text",
    children: (
      <>
        <span>September 2022 - Present </span>
        <span className="whitespace-nowrap">(1 year, 8 months)</span>
      </>
    ),
  },
  {
    key: "skill-count",
    type: "text",
    children: "13 skills",
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
    design: {
      type: "figma",
      url: "https://www.figma.com/design/tam2tiCQQeZoGiQ9jMM58c/Career-experience--Applicants-?node-id=5-3199&m=dev",
    },
  },
} as Meta<typeof PreviewList.Root>;

const Template: StoryFn<typeof PreviewList.Root> = (args) => {
  const { children } = args;

  return (
    // something like TaskCard
    <div className="bg-white dark:bg-gray-600">
      <PreviewList.Root>{children}</PreviewList.Root>
    </div>
  );
};

export const Default = Template.bind({});
Default.args = {
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
};

export const WithChildren = Template.bind({});
WithChildren.args = {
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
};

export const SingleTimelineExperience = Template.bind({});
SingleTimelineExperience.args = {
  children: (
    <>
      <PreviewList.Item
        title="IT-01: Junior application developer"
        metaData={experienceDetails}
        action={
          <PreviewList.Button
            label="View preview button one"
            onClick={() => action("preview button one clicked")()}
          />
        }
        mode="experience"
        index={0}
        groupLength={1}
      >
        <p>{faker.lorem.sentence()}</p>
      </PreviewList.Item>
    </>
  ),
};

export const MultipleTimelineExperiences = Template.bind({});
MultipleTimelineExperiences.args = {
  children: (
    <>
      <PreviewList.Item
        title="IT-01: Junior application developer"
        metaData={experienceDetails}
        action={
          <PreviewList.Button
            label="View preview button one"
            onClick={() => action("preview button one clicked")()}
          />
        }
        mode="experience"
        index={0}
        groupLength={4}
      >
        <p>{faker.lorem.sentence()}</p>
      </PreviewList.Item>
      <PreviewList.Item
        title="IT-01: Junior application developer"
        metaData={experienceDetails}
        action={
          <PreviewList.Button
            label="View preview button one"
            onClick={() => action("preview button one clicked")()}
          />
        }
        mode="experience"
        index={1}
        groupLength={4}
      >
        <p>{faker.lorem.sentences(2)}</p>
      </PreviewList.Item>
      <PreviewList.Item
        title="IT-01: Junior application developer"
        metaData={experienceDetails}
        action={
          <PreviewList.Button
            label="View preview button one"
            onClick={() => action("preview button one clicked")()}
          />
        }
        mode="experience"
        index={2}
        groupLength={4}
      >
        <p>{faker.lorem.paragraph()}</p>
      </PreviewList.Item>
      <PreviewList.Item
        title="IT-01: Junior application developer"
        metaData={experienceDetails}
        action={
          <PreviewList.Button
            label="View preview button one"
            onClick={() => action("preview button one clicked")()}
          />
        }
        mode="experience"
        index={3}
        groupLength={4}
      >
        <p>{faker.lorem.paragraph()}</p>
      </PreviewList.Item>
    </>
  ),
};
