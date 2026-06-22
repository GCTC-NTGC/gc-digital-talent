import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  fakeLocalizedEnum,
  fakeUsers,
  toLocalizedEnum,
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
    referralDecisions: fakeLocalizedEnum(
      TalentRequestTrackedUserReferralDecision,
    ).map((opt) => ({
      __typename: "LocalizedTalentRequestTrackedUserReferralDecision" as const,
      ...toLocalizedEnum(opt.value),
    })),
    selectionDecisions: fakeLocalizedEnum(
      TalentRequestTrackedUserSelectionDecision,
    ).map((opt) => ({
      __typename: "LocalizedTalentRequestTrackedUserSelectionDecision" as const,
      ...toLocalizedEnum(opt.value),
    })),
    notReferredReasons: fakeLocalizedEnum(
      TalentRequestTrackedUserNotReferredReason,
    ).map((opt) => ({
      __typename: "LocalizedTalentRequestTrackedUserNotReferredReason" as const,
      ...toLocalizedEnum(opt.value),
    })),
    notSelectedReasons: fakeLocalizedEnum(
      TalentRequestTrackedUserNotSelectedReason,
    ).map((opt) => ({
      __typename: "LocalizedTalentRequestTrackedUserNotSelectedReason" as const,
      ...toLocalizedEnum(opt.value),
    })),
    talentRequestSources: fakeLocalizedEnum(TalentRequestSource).map((opt) => ({
      __typename: "LocalizedTalentRequestSource" as const,
      ...toLocalizedEnum(opt.value),
    })),
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
        user: { id: user.id, firstName: user.firstName, lastName: user.lastName },
        sources: [
          {
            label: { localized: "Qualified in pool" },
          },
        ],
        matchingQualifiedInPoolSources: [
          makeFragmentData(
            {
              id: "pool-candidate-1",
              pool: {
                displayName: {
                  display: { localized: "IT-02" },
                },
              },
            },
            ReferralMatchingPoolSource_Fragment,
          ),
        ],
        referralSummary: makeFragmentData(
          {
            referredCount: 3,
            notSelectedReasons: [
              {
                reason: {
                  value: TalentRequestTrackedUserNotSelectedReason.Other,
                  label: { localized: "Other" },
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
