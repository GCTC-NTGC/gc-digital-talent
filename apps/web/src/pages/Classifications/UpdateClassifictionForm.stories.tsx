import React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import { fakeClassifications } from "@gc-digital-talent/fake-data";

import { UpdateClassificationForm } from "./UpdateClassificationPage";

const mockClassifications = fakeClassifications();

export default {
  component: UpdateClassificationForm,
  title: "Forms/Update Classification Form",
} as ComponentMeta<typeof UpdateClassificationForm>;

const Template: ComponentStory<typeof UpdateClassificationForm> = (args) => {
  const { initialClassification } = args;

  return (
    <UpdateClassificationForm
      initialClassification={initialClassification}
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
  initialClassification: mockClassifications[0],
};
