import React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";

import { fakeClassifications } from "@gc-digital-talent/fake-data";

import { ClassificationTable } from "./ClassificationTable";

const mockClassifications = fakeClassifications();

export default {
  component: ClassificationTable,
  title: "Tables/Classification Table",
} as ComponentMeta<typeof ClassificationTable>;

const Template: ComponentStory<typeof ClassificationTable> = (args) => {
  const { classifications, title } = args;
  return (
    <ClassificationTable classifications={classifications} title={title} />
  );
};

export const Default = Template.bind({});
Default.args = {
  classifications: mockClassifications,
  title: "Classifications",
};
