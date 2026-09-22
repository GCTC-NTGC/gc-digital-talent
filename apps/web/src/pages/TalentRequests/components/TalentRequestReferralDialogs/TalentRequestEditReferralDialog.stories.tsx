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
  TalentRequestTrackedUserNotSelectedReason,
  TalentRequestTrackedUserReferralDecision,
  TalentRequestTrackedUserSelectionDecision,
} from "@gc-digital-talent/graphql";
import {
  MockGraphqlDecorator,
  OverlayOrDialogDecorator,
} from "@gc-digital-talent/storybook-helpers";

import TalentRequestEditReferralDialog, {
  TalentRequestEditReferralDialog_Fragment,
} from "./TalentRequestEditReferralDialog";
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
  },
  TalentRequestReferralDialogOptions_Fragment,
);

const mockTrackedUser = {
  id: "tracked-user-1",
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
  user: {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
  },
};

const meta = {
  component: TalentRequestEditReferralDialog,
  decorators: [OverlayOrDialogDecorator, MockGraphqlDecorator],
  parameters: {
    apiResponses: {
      UpdateTalentRequestTrackedUser: {
        data: {
          updateTalentRequestTrackedUser: mockTrackedUser,
        },
      },
    },
  },
  args: {
    optionsQuery,
    defaultOpen: true,
  },
} satisfies Meta<typeof TalentRequestEditReferralDialog>;

export default meta;
type Story = StoryObj<typeof TalentRequestEditReferralDialog>;

export const Default: Story = {
  args: {
    query: makeFragmentData(
      mockTrackedUser,
      TalentRequestEditReferralDialog_Fragment,
    ),
  },
};

export const Referred: Story = {
  args: {
    query: makeFragmentData(
      {
        ...mockTrackedUser,
        referralDecision: toLocalizedEnum(
          TalentRequestTrackedUserReferralDecision.Referred,
          "LocalizedTalentRequestTrackedUserReferralDecision",
        ),
      },
      TalentRequestEditReferralDialog_Fragment,
    ),
  },
};

export const Selected: Story = {
  args: {
    query: makeFragmentData(
      {
        ...mockTrackedUser,
        referralDecision: toLocalizedEnum(
          TalentRequestTrackedUserReferralDecision.Referred,
          "LocalizedTalentRequestTrackedUserReferralDecision",
        ),
        selectionDecision: toLocalizedEnum(
          TalentRequestTrackedUserSelectionDecision.Selected,
          "LocalizedTalentRequestTrackedUserSelectionDecision",
        ),
      },
      TalentRequestEditReferralDialog_Fragment,
    ),
  },
};

export const NotSelected: Story = {
  args: {
    query: makeFragmentData(
      {
        ...mockTrackedUser,
        referralDecision: toLocalizedEnum(
          TalentRequestTrackedUserReferralDecision.Referred,
          "LocalizedTalentRequestTrackedUserReferralDecision",
        ),
        selectionDecision: toLocalizedEnum(
          TalentRequestTrackedUserSelectionDecision.NotSelected,
          "LocalizedTalentRequestTrackedUserSelectionDecision",
        ),
        notSelectedReason: toLocalizedEnum(
          TalentRequestTrackedUserNotSelectedReason.Other,
          "LocalizedTalentRequestTrackedUserNotSelectedReason",
        ),
      },
      TalentRequestEditReferralDialog_Fragment,
    ),
  },
};

export const NotReferred: Story = {
  args: {
    query: makeFragmentData(
      {
        ...mockTrackedUser,
        referralDecision: toLocalizedEnum(
          TalentRequestTrackedUserReferralDecision.NotReferred,
          "LocalizedTalentRequestTrackedUserReferralDecision",
        ),
        notReferredReason: toLocalizedEnum(
          TalentRequestTrackedUserNotReferredReason.Other,
          "LocalizedTalentRequestTrackedUserNotReferredReason",
        ),
      },
      TalentRequestEditReferralDialog_Fragment,
    ),
  },
};
