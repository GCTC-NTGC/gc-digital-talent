import React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import { CHROMATIC_VIEWPORTS } from "@gc-digital-talent/storybook-helpers";
import { fakePoolCandidates } from "@gc-digital-talent/fake-data";
import { IndigenousCommunity } from "@gc-digital-talent/graphql";

import { ApplicationSelfDeclaration } from "../ApplicationSelfDeclarationPage";

const mockApplication = fakePoolCandidates(1)[0];

export default {
  component: ApplicationSelfDeclaration,
  title: "Application/Self-Declaration",
} as ComponentMeta<typeof ApplicationSelfDeclaration>;

const Template: ComponentStory<typeof ApplicationSelfDeclaration> = () => (
  <ApplicationSelfDeclaration
    onSubmit={(values) => action("onSubmit")(values)}
    application={mockApplication}
    indigenousCommunities={[IndigenousCommunity.Inuit]}
    signature="Lorem Ipsum"
  />
);

export const Default = Template.bind({});
Default.parameters = {
  chromatic: { viewports: CHROMATIC_VIEWPORTS },
};
