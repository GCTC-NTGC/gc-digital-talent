import React from "react";
import { Meta, StoryFn } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import { fakeClassifications } from "@gc-digital-talent/fake-data";
import { makeFragmentData } from "@gc-digital-talent/graphql";

import {
  ClassificationForm_Fragment,
  UpdateClassificationForm,
} from "./UpdateClassificationPage";

const mockClassifications = fakeClassifications();
const classification = makeFragmentData(
  mockClassifications[0],
  ClassificationForm_Fragment,
);

export default {
  component: UpdateClassificationForm,
  title: "Forms/Update Classification Form",
} as Meta<typeof UpdateClassificationForm>;

const Template: StoryFn<typeof UpdateClassificationForm> = (args) => {
  const { query } = args;

  return (
    <UpdateClassificationForm
      query={query}
      onUpdateClassification={async (id, data) => {
        return new Promise((resolve) => {
          setTimeout(() => {
            action("Update Classification")({
              id,
              data,
            });
            resolve(data);
          }, 1000);
        });
      }}
    />
  );
};

export const Default = Template.bind({});
Default.args = {
  query: classification,
};
