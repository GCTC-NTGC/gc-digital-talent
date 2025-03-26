import type { StoryFn } from "@storybook/react";
import { faker } from "@faker-js/faker/locale/en";

import {
  makeFragmentData,
  NominationGroupSidebarFragment as NominationGroupSidebarFragmentType,
} from "@gc-digital-talent/graphql";
import {
  fakeClassifications,
  fakeDepartments,
} from "@gc-digital-talent/fake-data";

import NominationGroupSidebar, {
  NominationGroupSidebar_Fragment,
} from "./NominationGroupSidebar";

faker.seed(0);

const talentNominationGroup: NominationGroupSidebarFragmentType = {
  id: "id-123",
  nominee: {
    id: "nominee-123",
    firstName: "First",
    lastName: "Last",
    email: "Email",
    workEmail: "Work email",
    currentClassification: fakeClassifications()[0],
    department: fakeDepartments()[0],
  },
  nominations: [
    {
      id: "nomination-123",
      nominator: { id: "nominator-123", firstName: "A", lastName: "B" },
    },
    {
      id: "nomination-456",
      nominator: { id: "nominator-123", firstName: "A", lastName: "C" },
    },
  ],
};

export default {
  component: NominationGroupSidebar,
};

const Template: StoryFn<typeof NominationGroupSidebar> = (args) => (
  <NominationGroupSidebar {...args} />
);

export const Default = Template.bind({});
Default.args = {
  talentNominationGroupQuery: makeFragmentData(
    talentNominationGroup,
    NominationGroupSidebar_Fragment,
  ),
};
