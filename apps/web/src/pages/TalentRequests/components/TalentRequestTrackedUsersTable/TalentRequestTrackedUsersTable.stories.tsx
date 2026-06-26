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
  TalentRequestTrackedUserStatus,
} from "@gc-digital-talent/graphql";

import TalentRequestTrackedUsersTable from "./TalentRequestTrackedUsersTable";
import { TalentRequestUserSkillMatch_Fragment } from "../skillMatchFragment";

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
    status: toLocalizedEnum(TalentRequestTrackedUserStatus.NotReferred),
    notReferredReason: toLocalizedEnum(
      TalentRequestTrackedUserNotReferredReason.Other,
    ),
    notSelectedReason: null,
    user: {
      ...users[1],
      priority: toLocalizedEnum(PriorityWeight.CitizenOrPermanentResident),
    },
  },
  {
    id: "tracked-user-3",
    skillCount: matchedSkillCount,
    status: toLocalizedEnum(TalentRequestTrackedUserStatus.Selected),
    notReferredReason: null,
    notSelectedReason: null,
    user: {
      ...users[2],
      priority: toLocalizedEnum(PriorityWeight.PriorityEntitlement),
    },
  },
  {
    id: "tracked-user-4",
    skillCount: matchedSkillCount,
    status: toLocalizedEnum(TalentRequestTrackedUserStatus.NotSelected),
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
          statuses: Object.values(TalentRequestTrackedUserStatus).map(
            (value) => ({
              __typename: "LocalizedTalentRequestTrackedUserStatus" as const,
              ...toLocalizedEnum(value),
            }),
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
} as Meta<typeof TalentRequestTrackedUsersTable>;

const storySkills = requestSkills.map((skill) =>
  makeFragmentData(skill, TalentRequestUserSkillMatch_Fragment),
);

const Template: StoryFn<typeof TalentRequestTrackedUsersTable> = (args) => (
  <TalentRequestTrackedUsersTable {...args} />
);

export const Default = Template.bind({});
Default.args = {
  talentRequestId: "tracked-users-story",
  skillsQuery: storySkills,
};
