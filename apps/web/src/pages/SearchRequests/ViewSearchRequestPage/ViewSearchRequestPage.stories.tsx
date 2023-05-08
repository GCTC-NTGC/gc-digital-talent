import React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";

import { fakeSearchRequests } from "@gc-digital-talent/fake-data";

import { ViewSearchRequest } from "./components/ViewSearchRequest";

const mockSearchRequests = fakeSearchRequests();

export default {
  component: ViewSearchRequest,
  title: "Pages/View Search Request Page",
  parameters: {
    themeKey: "admin",
  },
} as ComponentMeta<typeof ViewSearchRequest>;

const Template: ComponentStory<typeof ViewSearchRequest> = (args) => {
  const { searchRequest, title } = args;

  return <ViewSearchRequest searchRequest={searchRequest} title={title} />;
};

export const Default = Template.bind({});
Default.args = {
  searchRequest: mockSearchRequests[0],
  title: "Request",
};
