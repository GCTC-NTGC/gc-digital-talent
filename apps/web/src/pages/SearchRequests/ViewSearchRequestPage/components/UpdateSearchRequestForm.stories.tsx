import React from "react";
import { Meta, StoryFn } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import { fakeSearchRequests } from "@gc-digital-talent/fake-data";

import { UpdateSearchRequestForm } from "./UpdateSearchRequest";

const mockSearchRequests = fakeSearchRequests();

export default {
  component: UpdateSearchRequestForm,
  title: "Forms/Update Search Request Form",
} as Meta<typeof UpdateSearchRequestForm>;

const Template: StoryFn<typeof UpdateSearchRequestForm> = (args) => {
  const { initialSearchRequest } = args;

  return (
    <UpdateSearchRequestForm
      initialSearchRequest={initialSearchRequest}
      handleUpdateSearchRequest={async (id, data) => {
        return new Promise((resolve) => {
          setTimeout(() => {
            action("Update SearchRequest")({
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
  initialSearchRequest: mockSearchRequests[0],
};
