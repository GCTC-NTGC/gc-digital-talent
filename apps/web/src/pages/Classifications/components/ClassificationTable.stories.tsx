import { Meta, StoryFn } from "@storybook/react-vite";

import { fakeClassifications } from "@gc-digital-talent/fake-data";
import { makeFragmentData } from "@gc-digital-talent/graphql";

import {
  ClassificationTable,
  ClassificationTableRow_Fragment,
} from "./ClassificationTable";

const mockClassifications = fakeClassifications();
const classifications = mockClassifications.map((classification) =>
  makeFragmentData(classification, ClassificationTableRow_Fragment),
);

export default {
  component: ClassificationTable,
} as Meta<typeof ClassificationTable>;

const Template: StoryFn<typeof ClassificationTable> = (args) => {
  const { classificationsQuery, title } = args;
  return (
    <ClassificationTable
      classificationsQuery={classificationsQuery}
      title={title}
    />
  );
};

export const Default = {
  render: Template,

  args: {
    classificationsQuery: classifications,
    title: "Classifications",
  },
};
