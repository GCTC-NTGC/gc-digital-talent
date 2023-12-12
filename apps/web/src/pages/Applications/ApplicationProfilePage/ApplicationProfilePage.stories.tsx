import React from "react";
import { StoryFn } from "@storybook/react";

import { fakePoolCandidates, fakeUsers } from "@gc-digital-talent/fake-data";
import { makeFragmentData } from "@gc-digital-talent/graphql";

import {
  ApplicationProfile,
  Application_UserProfileFragment,
} from "./ApplicationProfilePage";
import { Application_PoolCandidateFragment } from "../ApplicationApi";

const mockUser = fakeUsers(1)[0];
const mockPoolCandidate = {
  ...fakePoolCandidates(1)[0],
  user: mockUser,
};
const mockPoolCandidateFragment = makeFragmentData(
  mockPoolCandidate,
  Application_PoolCandidateFragment,
);
const mockUserFragment = makeFragmentData(
  mockUser,
  Application_UserProfileFragment,
);

export default {
  component: ApplicationProfile,
  title: "Pages/Application/Profile",
  args: {
    query: mockPoolCandidateFragment,
    userQuery: mockUserFragment,
  },
};

const Template: StoryFn<typeof ApplicationProfile> = (args) => {
  return <ApplicationProfile {...args} />;
};

export const Default = Template.bind({});

export const EmptyUser = Template.bind({});
EmptyUser.args = {
  userQuery: makeFragmentData(
    { id: mockUser.id },
    Application_UserProfileFragment,
  ),
};
