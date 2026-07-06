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
  TalentRequestEditReferralDialogSourceOptions_Fragment,
} from "./TalentRequestEditReferralDialog";
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
  },
  TalentRequestReferralDialogOptions_Fragment,
);

const sourceOptionsQuery = makeFragmentData(
  {
    talentRequestSources: fakeLocalizedEnum(TalentRequestSource).map((opt) => ({
      __typename: "LocalizedTalentRequestSource" as const,
      ...toLocalizedEnum(opt.value),
    })),
  },
  TalentRequestEditReferralDialogSourceOptions_Fragment,
);

const mockTrackedUser = {
  id: "tracked-user-1",
  referralDecision: null,
  selectionDecision: null,
  notReferredReason: null,
  notSelectedReason: null,
  sources: [toLocalizedEnum(TalentRequestSource.QualifiedInPool)],
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
    sourceOptionsQuery,
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
        ),
        selectionDecision: toLocalizedEnum(
          TalentRequestTrackedUserSelectionDecision.Selected,
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
        ),
        selectionDecision: toLocalizedEnum(
          TalentRequestTrackedUserSelectionDecision.NotSelected,
        ),
        notSelectedReason: toLocalizedEnum(
          TalentRequestTrackedUserNotSelectedReason.Other,
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
        ),
        notReferredReason: toLocalizedEnum(
          TalentRequestTrackedUserNotReferredReason.Other,
        ),
      },
      TalentRequestEditReferralDialog_Fragment,
    ),
  },
};
