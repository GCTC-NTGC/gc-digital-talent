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
  args: {
    searchRequestQuery: mockSearchRequests[0],
  },
} as ComponentMeta<typeof ViewSearchRequest>;

const Template: ComponentStory<typeof ViewSearchRequest> = (args) => {
  const { searchRequestQuery } = args;

  return <ViewSearchRequest searchRequestQuery={searchRequestQuery} />;
};

export const Default = Template.bind({});
