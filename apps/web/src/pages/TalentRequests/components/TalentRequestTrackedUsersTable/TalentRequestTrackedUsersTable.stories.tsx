import type { Meta, StoryFn } from "@storybook/react-vite";

import {
  fakeSkills,
  fakeUsers,
  toLocalizedEnum,
} from "@gc-digital-talent/fake-data";
import {
  makeFragmentData,
  PriorityWeight,
  TalentRequestTrackedUserNotReferredReason,
  TalentRequestTrackedUserNotSelectedReason,
  TalentRequestTrackedUserReferralDecision,
  TalentRequestTrackedUserSelectionDecision,
} from "@gc-digital-talent/graphql";

import TalentRequestTrackedUsersTable from "./TalentRequestTrackedUsersTable";
import { TrackedUserSkill_Fragment } from "./TalentRequestTrackedUserSkillsDialog";

const users = fakeUsers(4);

// The request matches against 5 skills; the mocked tracked users each claim 3 of them.
const requestSkills = fakeSkills(5);
const claimedSkillIds = requestSkills.slice(0, 3).map((skill) => skill.id);
const matchedSkillCount = claimedSkillIds.length;

const trackedUsers = [
  {
    id: "tracked-user-1",
    skillCount: matchedSkillCount,
    referralDecision: null,
    selectionDecision: null,
    notReferredReason: null,
    notSelectedReason: null,
    user: {
      ...users[0],
      priority: toLocalizedEnum(PriorityWeight.Veteran),
    },
  },
  {
    id: "tracked-user-2",
    skillCount: matchedSkillCount,
    referralDecision: toLocalizedEnum(
      TalentRequestTrackedUserReferralDecision.Referred,
    ),
    selectionDecision: null,
    notReferredReason: null,
    notSelectedReason: null,
    user: {
      ...users[1],
      priority: toLocalizedEnum(PriorityWeight.CitizenOrPermanentResident),
    },
  },
  {
    id: "tracked-user-3",
    skillCount: matchedSkillCount,
    referralDecision: toLocalizedEnum(
      TalentRequestTrackedUserReferralDecision.NotReferred,
    ),
    selectionDecision: null,
    notReferredReason: toLocalizedEnum(
      TalentRequestTrackedUserNotReferredReason.Other,
    ),
    notSelectedReason: null,
    user: {
      ...users[2],
      priority: toLocalizedEnum(PriorityWeight.PriorityEntitlement),
    },
  },
  {
    id: "tracked-user-4",
    skillCount: matchedSkillCount,
    referralDecision: toLocalizedEnum(
      TalentRequestTrackedUserReferralDecision.Referred,
    ),
    selectionDecision: toLocalizedEnum(
      TalentRequestTrackedUserSelectionDecision.NotSelected,
    ),
    notReferredReason: null,
    notSelectedReason: toLocalizedEnum(
      TalentRequestTrackedUserNotSelectedReason.Other,
    ),
    user: {
      ...users[3],
      priority: toLocalizedEnum(PriorityWeight.Other),
    },
  },
];

const mockPaginatorInfo = {
  count: trackedUsers.length,
  currentPage: 1,
  firstItem: 1,
  hasMorePages: false,
  lastItem: trackedUsers.length,
  lastPage: 1,
  perPage: 10,
  total: trackedUsers.length,
};

export default {
  component: TalentRequestTrackedUsersTable,
  parameters: {
    apiResponses: {
      TalentRequestTrackedUsersPaginated: {
        data: {
          talentRequestTrackedUsers: {
            data: trackedUsers,
            paginatorInfo: mockPaginatorInfo,
          },
        },
      },
      TalentRequestTrackedUsersFilterData: {
        data: {
          referralDecisions: Object.values(
            TalentRequestTrackedUserReferralDecision,
          ).map((value) => ({
            __typename:
              "LocalizedTalentRequestTrackedUserReferralDecision" as const,
            ...toLocalizedEnum(value),
          })),
          selectionDecisions: Object.values(
            TalentRequestTrackedUserSelectionDecision,
          ).map((value) => ({
            __typename:
              "LocalizedTalentRequestTrackedUserSelectionDecision" as const,
            ...toLocalizedEnum(value),
          })),
        },
      },
      TrackedUserMatchedSkills: {
        data: {
          user: {
            id: "tracked-user-story-user",
            userSkills: claimedSkillIds.map((id) => ({ skill: { id } })),
          },
        },
      },
    },
  },
} as Meta<typeof TalentRequestTrackedUsersTable>;

const storySkills = requestSkills.map((skill) =>
  makeFragmentData(
    { id: skill.id, name: { localized: skill.name.en } },
    TrackedUserSkill_Fragment,
  ),
);

const Template: StoryFn<typeof TalentRequestTrackedUsersTable> = (args) => (
  <TalentRequestTrackedUsersTable {...args} />
);

export const Default = Template.bind({});
Default.args = {
  talentRequestId: "tracked-users-story",
  title: "Tracked candidates",
  skills: storySkills,
};
