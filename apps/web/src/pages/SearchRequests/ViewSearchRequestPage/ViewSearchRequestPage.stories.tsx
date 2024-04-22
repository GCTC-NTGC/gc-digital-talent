import React from "react";
import { Meta, StoryFn } from "@storybook/react";

import { fakeSearchRequests } from "@gc-digital-talent/fake-data";
import { allModes } from "@gc-digital-talent/storybook-helpers";

import { ViewSearchRequest } from "./components/ViewSearchRequest";

const mockSearchRequests = fakeSearchRequests();

export default {
  component: ViewSearchRequest,
  title: "Pages/View Search Request Page",
  args: {
    searchRequestQuery: mockSearchRequests[0],
  },
  parameters: {
    chromatic: {
      modes: {
        light: allModes.light,
        "light mobile": allModes["light mobile"],
      },
    },
  },
} as Meta<typeof ViewSearchRequest>;

const Template: StoryFn<typeof ViewSearchRequest> = (args) => {
  const { searchRequestQuery } = args;

  return <ViewSearchRequest searchRequestQuery={searchRequestQuery} />;
};

export const Default = Template.bind({});
