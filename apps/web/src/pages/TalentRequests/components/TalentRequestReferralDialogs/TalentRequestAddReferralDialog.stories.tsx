import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  fakeLocalizedEnum,
  fakeUsers,
  toLocalizedEnum,
  toLocalizedString,
} from "@gc-digital-talent/fake-data";
import {
  makeFragmentData,
  TalentRequestSource,
  TalentRequestTrackedUserNotReferredReason,
  TalentRequestTrackedUserReferralDecision,
  TalentRequestTrackedUserSelectionDecision,
  TalentRequestTrackedUserNotSelectedReason,
} from "@gc-digital-talent/graphql";
import {
  MockGraphqlDecorator,
  OverlayOrDialogDecorator,
} from "@gc-digital-talent/storybook-helpers";

import TalentRequestAddReferralDialog, {
  TalentRequestAddReferralDialog_Fragment,
} from "./TalentRequestAddReferralDialog";
import { TalentRequestReferralDialogOptions_Fragment } from "./ReferralFormFields";
import { ReferralHistory_Fragment } from "./ReferralHistory";
import { ReferralMatchingPoolSource_Fragment } from "./ReferralMatchingSources";

const [user] = fakeUsers(1);

const optionsQuery = makeFragmentData(
  {
    __typename: "Query",
    referralDecisions: fakeLocalizedEnum(
      TalentRequestTrackedUserReferralDecision,
      "LocalizedTalentRequestTrackedUserReferralDecision",
    ),
    selectionDecisions: fakeLocalizedEnum(
      TalentRequestTrackedUserSelectionDecision,
      "LocalizedTalentRequestTrackedUserSelectionDecision",
    ),
    notReferredReasons: fakeLocalizedEnum(
      TalentRequestTrackedUserNotReferredReason,
      "LocalizedTalentRequestTrackedUserNotReferredReason",
    ),
    notSelectedReasons: fakeLocalizedEnum(
      TalentRequestTrackedUserNotSelectedReason,
      "LocalizedTalentRequestTrackedUserNotSelectedReason",
    ),
  },
  TalentRequestReferralDialogOptions_Fragment,
);

const meta = {
  component: TalentRequestAddReferralDialog,
  decorators: [OverlayOrDialogDecorator, MockGraphqlDecorator],
  parameters: {
    apiResponses: {
      CreateTalentRequestTrackedUser: {
        data: {
          createTalentRequestTrackedUser: {
            id: "new-tracked-user-id",
            referralDecision: null,
            notReferredReason: null,
          },
        },
      },
    },
  },
  args: {
    query: makeFragmentData(
      {
        __typename: "TalentRequestResult",
        user: {
          __typename: "User",
          id: user.id,
          firstName: user.firstName ?? null,
          lastName: user.lastName ?? null,
        },
        sources: [
          toLocalizedEnum(
            TalentRequestSource.QualifiedInPool,
            "LocalizedTalentRequestSource",
          ),
        ],
        matchingQualifiedInPoolSources: [
          {
            __typename: "PoolCandidate",
            ...makeFragmentData(
              {
                __typename: "PoolCandidate",
                id: "pool-candidate-1",
                pool: {
                  __typename: "Pool",
                  displayName: {
                    __typename: "DefinedString",
                    display: toLocalizedString("IT-02"),
                  },
                },
              },
              ReferralMatchingPoolSource_Fragment,
            ),
          },
        ],
        matchingAdvancementSources: [],
        matchingLateralMovementSources: [],
        referralSummary: {
          __typename: "TalentRequestReferralSummary",
          ...makeFragmentData(
            {
              __typename: "TalentRequestReferralSummary",
              referredCount: 3,
              notSelectedReasons: [
                {
                  __typename: "TalentRequestNotSelectedReasonCount",
                  reason: toLocalizedEnum(
                    TalentRequestTrackedUserNotSelectedReason.Other,
                    "LocalizedTalentRequestTrackedUserNotSelectedReason",
                  ),
                  count: 2,
                },
              ],
            },
            ReferralHistory_Fragment,
          ),
        },
      },
      TalentRequestAddReferralDialog_Fragment,
    ),
    talentRequestId: "talent-request-1",
    optionsQuery,
    defaultOpen: true,
  },
} satisfies Meta<typeof TalentRequestAddReferralDialog>;

export default meta;
type Story = StoryObj<typeof TalentRequestAddReferralDialog>;

export const Default: Story = {};

export const NotReferred: Story = {};
