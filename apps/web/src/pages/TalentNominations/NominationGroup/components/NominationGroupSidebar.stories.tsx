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
  __typename: "TalentNominationGroup" as const,
  id: "id-123",
  consentToShareProfile: true,
  advancementNominationCount: 3,
  advancementDecision: { value: TalentNominationGroupDecision.Approved },
  lateralMovementNominationCount: 1,
  lateralMovementDecision: {
    value: TalentNominationGroupDecision.Rejected,
  },
  status: {
    __typename: "LocalizedTalentNominationGroupStatus" as const,
    value: TalentNominationGroupStatus.InProgress,
    label: { __typename: "LocalizedString" as const, localized: "In progress" },
  },
  nominee: {
    __typename: "BasicGovEmployeeProfile" as const,
    id: "nominee-123",
    isVerifiedGovEmployee: true,
    firstName: "Forename",
    lastName: "Surname",
    role: null,
    workEmail: "test@gc.ca",
    preferredLang: {
      __typename: "LocalizedLanguage" as const,
      label: { __typename: "LocalizedString" as const, localized: "LANG" },
    },
    classification: fakeClassifications()[0],
    department: fakeDepartment,
  },
  nominations: [
    {
      __typename: "TalentNomination" as const,
      id: "nomination-123",
      nominator: {
        __typename: "BasicGovEmployeeProfile" as const,
        id: "nominator-123",
        firstName: "Admin",
        lastName: "A",
      },
    },
    {
      __typename: "TalentNomination" as const,
      id: "nomination-456",
      nominator: {
        __typename: "BasicGovEmployeeProfile" as const,
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
    <aside className="w-1/2">
      <NominationGroupSidebar {...args} />
    </aside>
  ),
};
