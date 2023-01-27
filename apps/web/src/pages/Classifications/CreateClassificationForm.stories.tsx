import React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import { CreateClassificationForm } from "./CreateClassificationPage";

export default {
  component: CreateClassificationForm,
  title: "Forms/Create Classification Form",
} as ComponentMeta<typeof CreateClassificationForm>;

const Template: ComponentStory<typeof CreateClassificationForm> = () => (
  <CreateClassificationForm
    handleCreateClassification={async (data) => {
      await new Promise((resolve) => {
        setTimeout(resolve, 1000);
      });
      action("Create Classification")(data);
      return data;
    }}
  />
);

export const Default = Template.bind({});
