import type { Meta, StoryFn } from "@storybook/react-vite";

import {
  fakeSkills,
  fakeUsers,
  toLocalizedEnum,
} from "@gc-digital-talent/fake-data";
import {
  PriorityWeight,
  TalentRequestSource,
  TalentRequestTrackedUserNotReferredReason,
  TalentRequestTrackedUserNotSelectedReason,
  TalentRequestTrackedUserStatus,
} from "@gc-digital-talent/graphql";

import TalentRequestTrackedUsersInbox from "./TalentRequestTrackedUsersInbox";

const users = fakeUsers(4);

// The request matches against 5 skills; the mocked tracked users each claim 3 of them.
const requestSkills = fakeSkills(5);
const claimedSkillIds = requestSkills.slice(0, 3).map((skill) => skill.id);
const matchedSkillCount = claimedSkillIds.length;

const trackedUsers = [
  {
    id: "tracked-user-1",
    skillCount: matchedSkillCount,
    status: toLocalizedEnum(TalentRequestTrackedUserStatus.Referred),
    referralDecision: null,
    selectionDecision: null,
    notReferredReason: null,
    notSelectedReason: null,
    sources: [toLocalizedEnum(TalentRequestSource.QualifiedInPool)],
    user: {
      ...users[0],
      priority: toLocalizedEnum(PriorityWeight.Veteran),
    },
  },
  {
    id: "tracked-user-2",
    skillCount: matchedSkillCount,
    status: toLocalizedEnum(TalentRequestTrackedUserStatus.NotReferred),
    referralDecision: null,
    selectionDecision: null,
    notReferredReason: toLocalizedEnum(
      TalentRequestTrackedUserNotReferredReason.Other,
    ),
    notSelectedReason: null,
    sources: [toLocalizedEnum(TalentRequestSource.AtLevel)],
    user: {
      ...users[1],
      priority: toLocalizedEnum(PriorityWeight.CitizenOrPermanentResident),
    },
  },
  {
    id: "tracked-user-3",
    skillCount: matchedSkillCount,
    status: toLocalizedEnum(TalentRequestTrackedUserStatus.Selected),
    referralDecision: null,
    selectionDecision: null,
    notReferredReason: null,
    notSelectedReason: null,
    sources: [toLocalizedEnum(TalentRequestSource.Advancement)],
    user: {
      ...users[2],
      priority: toLocalizedEnum(PriorityWeight.PriorityEntitlement),
    },
  },
  {
    id: "tracked-user-4",
    skillCount: matchedSkillCount,
    status: toLocalizedEnum(TalentRequestTrackedUserStatus.NotSelected),
    referralDecision: null,
    selectionDecision: null,
    notReferredReason: null,
    notSelectedReason: toLocalizedEnum(
      TalentRequestTrackedUserNotSelectedReason.Other,
    ),
    sources: [toLocalizedEnum(TalentRequestSource.QualifiedInPool)],
    user: {
      ...users[3],
      priority: toLocalizedEnum(PriorityWeight.Other),
    },
  },
];

const mockPaginatorInfo = {
  total: trackedUsers.length,
  lastPage: 1,
};

const localizedStatuses = Object.values(TalentRequestTrackedUserStatus).map(
  (value) => ({
    __typename: "LocalizedTalentRequestTrackedUserStatus" as const,
    ...toLocalizedEnum(value),
  }),
);

export default {
  component: TalentRequestTrackedUsersInbox,
  parameters: {
    apiResponses: {
      TalentRequestTrackedUsersInbox: {
        data: {
          statuses: localizedStatuses,
          talentRequestTrackedUsers: {
            data: trackedUsers,
            paginatorInfo: mockPaginatorInfo,
          },
        },
      },
      InboxNotReferReasons: {
        data: {
          reasons: Object.values(TalentRequestTrackedUserNotReferredReason).map(
            (value) => toLocalizedEnum(value),
          ),
        },
      },
      InboxNotSelectReasons: {
        data: {
          reasons: Object.values(TalentRequestTrackedUserNotSelectedReason).map(
            (value) => toLocalizedEnum(value),
          ),
        },
      },
      SkillMatchDialog_Query: {
        data: {
          user: {
            experiences: [],
            userSkills: claimedSkillIds.map((id) => ({ skill: { id } })),
          },
        },
      },
    },
  },
} as Meta<typeof TalentRequestTrackedUsersInbox>;

const Template: StoryFn<typeof TalentRequestTrackedUsersInbox> = (args) => (
  <TalentRequestTrackedUsersInbox {...args} />
);

export const Default = Template.bind({});
Default.args = {
  talentRequestId: "tracked-users-inbox-story",
  requestedSkillsCount: requestSkills.length,
};
