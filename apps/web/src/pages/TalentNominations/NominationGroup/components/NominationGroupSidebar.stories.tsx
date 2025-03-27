import type { StoryFn } from "@storybook/react";
import { faker } from "@faker-js/faker/locale/en";

import {
  makeFragmentData,
  NominationGroupSidebarFragment as NominationGroupSidebarFragmentType,
  TalentNominationGroupDecision,
  TalentNominationGroupStatus,
} from "@gc-digital-talent/graphql";
import {
  fakeClassifications,
  fakeDepartments,
} from "@gc-digital-talent/fake-data";

import NominationGroupSidebar, {
  NominationGroupSidebar_Fragment,
} from "./NominationGroupSidebar";

faker.seed(0);

const fakeDepartment = fakeDepartments()[0];
fakeDepartment.name.localized = fakeDepartment.name.en;

const talentNominationGroup: NominationGroupSidebarFragmentType = {
  id: "id-123",
  advancementNominationCount: 3,
  advancementDecision: { value: TalentNominationGroupDecision.Approved },
  lateralMovementNominationCount: 1,
  lateralMovementDecision: { value: TalentNominationGroupDecision.Rejected },
  status: {
    value: TalentNominationGroupStatus.InProgress,
    label: { localized: "In progress" },
  },
  nominee: {
    id: "nominee-123",
    firstName: "Forename",
    lastName: "Surname",
    email: "test@test.com",
    workEmail: "test@gc.ca",
    telephone: "+123456789",
    preferredLang: { label: { localized: "LANG" } },
    currentClassification: fakeClassifications()[0],
    department: fakeDepartment,
  },
  nominations: [
    {
      id: "nomination-123",
      nominator: { id: "nominator-123", firstName: "Admin", lastName: "A" },
    },
    {
      id: "nomination-456",
      nominator: {
        id: "nominator-123",
        firstName: "Coordinator",
        lastName: "C",
      },
    },
  ],
};

export default {
  component: NominationGroupSidebar,
};

const Template: StoryFn<typeof NominationGroupSidebar> = (args) => (
  <aside data-h2-width="base(50%)">
    <NominationGroupSidebar {...args} />
  </aside>
);

export const Default = Template.bind({});
Default.args = {
  talentNominationGroupQuery: makeFragmentData(
    talentNominationGroup,
    NominationGroupSidebar_Fragment,
  ),
};
