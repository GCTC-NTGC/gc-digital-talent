import type { Meta, StoryObj } from "@storybook/react-vite";
import { faker } from "@faker-js/faker/locale/en";

import {
  makeFragmentData,
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

const talentNominationGroup = {
  id: "id-123",
  advancementNominationCount: 3,
  advancementDecision: { value: TalentNominationGroupDecision.Approved },
  lateralMovementNominationCount: 1,
  lateralMovementDecision: {
    value: TalentNominationGroupDecision.Rejected,
  },
  status: {
    value: TalentNominationGroupStatus.InProgress,
    label: { localized: "In progress" },
  },
  nominee: {
    id: "nominee-123",
    firstName: "Forename",
    lastName: "Surname",
    workEmail: "test@gc.ca",
    preferredLang: { label: { localized: "LANG" } },
    classification: fakeClassifications()[0],
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

const ids = [faker.string.uuid(), faker.string.uuid(), faker.string.uuid()];

const meta = {
  component: NominationGroupSidebar,
  parameters: {
    defaultPath: {
      path: `/:locale/admin/talent-events/:eventId/nominations/:talentNominationGroupId`,
      initialEntries: [
        {
          pathname: `/en/admin/talent-events/${faker.string.uuid()}/nominations/${ids[1]}`,
          state: { nominationIds: ids },
        },
      ],
    },
  },
} satisfies Meta<typeof NominationGroupSidebar>;

export default meta;

export const Default: StoryObj<typeof NominationGroupSidebar> = {
  args: {
    talentNominationGroupQuery: makeFragmentData(
      talentNominationGroup,
      NominationGroupSidebar_Fragment,
    ),
  },
  render: (args) => (
    <aside data-h2-width="base(50%)">
      <NominationGroupSidebar {...args} />
    </aside>
  ),
};
