import { Meta, StoryFn } from "@storybook/react-vite";
import { action } from "storybook/actions";

import { CHROMATIC_VIEWPORTS } from "@gc-digital-talent/storybook-helpers";
import { fakePoolCandidates } from "@gc-digital-talent/fake-data";
import {
  IndigenousCommunity,
  Application_PoolCandidateFragment as ApplicationPoolCandidateFragmentType,
} from "@gc-digital-talent/graphql";

import { ApplicationSelfDeclaration } from "./ApplicationSelfDeclarationPage";

const mockApplication = fakePoolCandidates(
  1,
)[0] as ApplicationPoolCandidateFragmentType;

export default {
  component: ApplicationSelfDeclaration,
} as Meta<typeof ApplicationSelfDeclaration>;

const Template: StoryFn<typeof ApplicationSelfDeclaration> = () => (
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
