import React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { INITIAL_VIEWPORTS } from "@storybook/addon-viewport";
import { fakePoolCandidates } from "@gc-digital-talent/fake-data";
import { IndigenousCommunity } from "@gc-digital-talent/graphql";

import { widthOf, heightOf } from "storybook-helpers";

import { ApplicationSelfDeclaration } from "../ApplicationSelfDeclarationPage";

const mockApplication = fakePoolCandidates(1)[0];

export default {
  component: ApplicationSelfDeclaration,
  title: "Application Revamp/Self-Declaration",
  parameters: {
    themeKey: "iap",
  },
} as ComponentMeta<typeof ApplicationSelfDeclaration>;

const Template: ComponentStory<typeof ApplicationSelfDeclaration> = () => (
  <ApplicationSelfDeclaration
    onSubmit={(values) => action("onSubmit")(values)}
    application={mockApplication}
    indigenousCommunities={[IndigenousCommunity.Inuit]}
    signature="Lorem Ipsum"
  />
);

const VIEWPORTS = [
  widthOf(INITIAL_VIEWPORTS.iphonex), // Modern iPhone
  heightOf(INITIAL_VIEWPORTS.ipad12p), // Most common viewport size that falls within chromatic range
];

export const Default = Template.bind({});
Default.parameters = {
  chromatic: { viewports: VIEWPORTS },
};
