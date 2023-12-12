import React from "react";
import { StoryFn } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import { CHROMATIC_VIEWPORTS } from "@gc-digital-talent/storybook-helpers";
import { fakePoolCandidates, fakeUsers } from "@gc-digital-talent/fake-data";
import { makeFragmentData } from "@gc-digital-talent/graphql";

import {
  ApplicationSelfDeclaration,
  ApplicationSelfDeclaration_UserFragment,
} from "../ApplicationSelfDeclarationPage";
import { Application_PoolCandidateFragment } from "../../ApplicationApi";

const mockUser = fakeUsers(1)[0];
const mockApplication = fakePoolCandidates(1)[0];
const mockPoolCandidateFragment = makeFragmentData(
  {
    ...mockApplication,
    user: mockUser,
  },
  Application_PoolCandidateFragment,
);

const mockIndigenousIdentity = makeFragmentData(
  mockUser,
  ApplicationSelfDeclaration_UserFragment,
);

export default {
  component: ApplicationSelfDeclaration,
  title: "Application/Self-Declaration",
  parameters: {
    themeKey: "iap",
  },
};

const Template: StoryFn<typeof ApplicationSelfDeclaration> = () => (
  <ApplicationSelfDeclaration
    onSubmit={(values) => action("onSubmit")(values)}
    query={mockPoolCandidateFragment}
    indigenousQuery={mockIndigenousIdentity}
  />
);

export const Default = Template.bind({});
Default.parameters = {
  chromatic: { viewports: CHROMATIC_VIEWPORTS },
};
