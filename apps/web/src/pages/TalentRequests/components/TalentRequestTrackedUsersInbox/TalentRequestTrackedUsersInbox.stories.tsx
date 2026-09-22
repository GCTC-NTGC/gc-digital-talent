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
import { Card } from "@gc-digital-talent/ui";

import TalentRequestTrackedUsersInbox from "./TalentRequestTrackedUsersInbox";

const users = fakeUsers(4);

// The request matches against 5 skills; the mocked tracked users each claim 3 of them.
const requestSkills = fakeSkills(5);
const claimedSkillIds = requestSkills.slice(0, 3).map((skill) => skill.id);
const matchedSkillCount = claimedSkillIds.length;

const sharedTrackedUserFields = {
  sources: [],
  matchingQualifiedInPoolSources: [],
  referralDecision: null,
  selectionDecision: null,
  referralSummary: null,
};

const trackedUsers = [
  {
    ...sharedTrackedUserFields,
    id: "tracked-user-1",
    skillCount: matchedSkillCount,
    status: toLocalizedEnum(
      TalentRequestTrackedUserStatus.Referred,
      "LocalizedTalentRequestTrackedUserStatus",
    ),
    referralDecision: null,
    selectionDecision: null,
    notReferredReason: null,
    notSelectedReason: null,
    sources: [
      toLocalizedEnum(
        TalentRequestSource.QualifiedInPool,
        "LocalizedTalentRequestSource",
      ),
    ],
    user: {
      ...users[0],
      priority: toLocalizedEnum(
        PriorityWeight.Veteran,
        "LocalizedPriorityWeight",
      ),
    },
  },
  {
    ...sharedTrackedUserFields,
    id: "tracked-user-2",
    skillCount: matchedSkillCount,
    status: toLocalizedEnum(
      TalentRequestTrackedUserStatus.NotReferred,
      "LocalizedTalentRequestTrackedUserStatus",
    ),
    referralDecision: null,
    selectionDecision: null,
    notReferredReason: toLocalizedEnum(
      TalentRequestTrackedUserNotReferredReason.Other,
      "LocalizedTalentRequestTrackedUserNotReferredReason",
    ),
    notSelectedReason: null,
    sources: [
      toLocalizedEnum(
        TalentRequestSource.AtLevel,
        "LocalizedTalentRequestSource",
      ),
    ],
    user: {
      ...users[1],
      priority: toLocalizedEnum(
        PriorityWeight.CitizenOrPermanentResident,
        "LocalizedPriorityWeight",
      ),
    },
  },
  {
    ...sharedTrackedUserFields,
    id: "tracked-user-3",
    skillCount: matchedSkillCount,
    status: toLocalizedEnum(
      TalentRequestTrackedUserStatus.Selected,
      "LocalizedTalentRequestTrackedUserStatus",
    ),
    referralDecision: null,
    selectionDecision: null,
    notReferredReason: null,
    notSelectedReason: null,
    sources: [
      toLocalizedEnum(
        TalentRequestSource.Advancement,
        "LocalizedTalentRequestSource",
      ),
    ],
    user: {
      ...users[2],
      priority: toLocalizedEnum(
        PriorityWeight.PriorityEntitlement,
        "LocalizedPriorityWeight",
      ),
    },
  },
  {
    ...sharedTrackedUserFields,
    id: "tracked-user-4",
    skillCount: matchedSkillCount,
    status: toLocalizedEnum(
      TalentRequestTrackedUserStatus.NotSelected,
      "LocalizedTalentRequestTrackedUserStatus",
    ),
    referralDecision: null,
    selectionDecision: null,
    notReferredReason: null,
    notSelectedReason: toLocalizedEnum(
      TalentRequestTrackedUserNotSelectedReason.Other,
      "LocalizedTalentRequestTrackedUserNotSelectedReason",
    ),
    sources: [
      toLocalizedEnum(
        TalentRequestSource.QualifiedInPool,
        "LocalizedTalentRequestSource",
      ),
    ],
    user: {
      ...users[3],
      priority: toLocalizedEnum(
        PriorityWeight.Other,
        "LocalizedPriorityWeight",
      ),
    },
  },
];

const mockPaginatorInfo = {
  total: trackedUsers.length,
  lastPage: 1,
};

const localizedStatuses = Object.values(TalentRequestTrackedUserStatus).map(
  (value) => toLocalizedEnum(value, "LocalizedTalentRequestTrackedUserStatus"),
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
            (value) =>
              toLocalizedEnum(
                value,
                "LocalizedTalentRequestTrackedUserNotReferredReason",
              ),
          ),
        },
      },
      InboxNotSelectReasons: {
        data: {
          reasons: Object.values(TalentRequestTrackedUserNotSelectedReason).map(
            (value) =>
              toLocalizedEnum(
                value,
                "LocalizedTalentRequestTrackedUserNotSelectedReason",
              ),
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
  <Card>
    <TalentRequestTrackedUsersInbox {...args} />
  </Card>
);

export const Default = Template.bind({});
Default.args = {
  talentRequestId: "tracked-users-inbox-story",
  requestedSkillsCount: requestSkills.length,
};
