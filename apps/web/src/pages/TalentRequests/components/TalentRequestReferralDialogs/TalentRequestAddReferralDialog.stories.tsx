import type { Meta, StoryObj } from "@storybook/react-vite";

import { fakeLocalizedEnum, fakeUsers } from "@gc-digital-talent/fake-data";
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
    talentRequestSources: fakeLocalizedEnum(
      TalentRequestSource,
      "LocalizedTalentRequestSource",
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
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
        },
        sources: [
          {
            __typename: "LocalizedTalentRequestSource",
            label: {
              __typename: "LocalizedString",
              localized: "Qualified in pool",
            },
          },
        ],
        matchingQualifiedInPoolSources: [
          makeFragmentData(
            {
              __typename: "PoolCandidate",
              id: "pool-candidate-1",
              pool: {
                __typename: "Pool",
                displayName: {
                  __typename: "DefinedString",
                  display: {
                    __typename: "LocalizedString",
                    localized: "IT-02",
                  },
                },
              },
            },
            ReferralMatchingPoolSource_Fragment,
          ),
        ],
        referralSummary: makeFragmentData(
          {
            __typename: "TalentRequestReferralSummary",
            referredCount: 3,
            notSelectedReasons: [
              {
                __typename: "TalentRequestNotSelectedReasonCount",
                reason: {
                  __typename:
                    "LocalizedTalentRequestTrackedUserNotSelectedReason",
                  value: TalentRequestTrackedUserNotSelectedReason.Other,
                  label: { __typename: "LocalizedString", localized: "Other" },
                },
                count: 2,
              },
            ],
          },
          ReferralHistory_Fragment,
        ),
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
