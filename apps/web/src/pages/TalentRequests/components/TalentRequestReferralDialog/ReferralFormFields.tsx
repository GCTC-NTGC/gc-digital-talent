import { useIntl } from "react-intl";
import { useFormContext } from "react-hook-form";

import {
  type FragmentType,
  TalentRequestTrackedUserReferralDecision,
  TalentRequestTrackedUserSelectionDecision,
  type TalentRequestTrackedUserNotReferredReason,
  type TalentRequestTrackedUserNotSelectedReason,
  getFragment,
  graphql,
} from "@gc-digital-talent/graphql";
import {
  commonMessages,
  errorMessages,
  narrowEnumType,
  uiMessages,
} from "@gc-digital-talent/i18n";
import { unpackMaybes } from "@gc-digital-talent/helpers";
import { Select } from "@gc-digital-talent/forms";
import { Notice } from "@gc-digital-talent/ui";

export const TalentRequestReferralDialogOptions_Fragment = graphql(
  /* GraphQL */ `
    fragment TalentRequestReferralDialogOptions on Query {
      referralDecisions: localizedEnumOptions(
        enumName: "TalentRequestTrackedUserReferralDecision"
      ) {
        ... on LocalizedTalentRequestTrackedUserReferralDecision {
          value
          label {
            localized
          }
        }
      }
      selectionDecisions: localizedEnumOptions(
        enumName: "TalentRequestTrackedUserSelectionDecision"
      ) {
        ... on LocalizedTalentRequestTrackedUserSelectionDecision {
          value
          label {
            localized
          }
        }
      }
      notReferredReasons: localizedEnumOptions(
        enumName: "TalentRequestTrackedUserNotReferredReason"
      ) {
        ... on LocalizedTalentRequestTrackedUserNotReferredReason {
          value
          label {
            localized
          }
        }
      }
      notSelectedReasons: localizedEnumOptions(
        enumName: "TalentRequestTrackedUserNotSelectedReason"
      ) {
        ... on LocalizedTalentRequestTrackedUserNotSelectedReason {
          value
          label {
            localized
          }
        }
      }
    }
  `,
);

export type TalentRequestReferralDialogOptions = FragmentType<
  typeof TalentRequestReferralDialogOptions_Fragment
>;

export interface FormValues {
  referralDecision: TalentRequestTrackedUserReferralDecision;
  notReferredReason?: TalentRequestTrackedUserNotReferredReason | null;
  selectionDecision?: TalentRequestTrackedUserSelectionDecision | null;
  notSelectedReason?: TalentRequestTrackedUserNotSelectedReason | null;
}

interface ReferralFormFieldsProps {
  optionsQuery?: TalentRequestReferralDialogOptions;
  showSelectionDecision?: boolean;
}

const ReferralFormFields = ({
  optionsQuery,
  showSelectionDecision = true,
}: ReferralFormFieldsProps) => {
  const intl = useIntl();
  const { watch } = useFormContext<FormValues>();
  const referralDecision = watch("referralDecision");
  const selectionDecision = watch("selectionDecision");
  const options = getFragment(
    TalentRequestReferralDialogOptions_Fragment,
    optionsQuery,
  );
  const notAvailable = intl.formatMessage(commonMessages.notAvailable);

  const referralDecisionOptions = narrowEnumType(
    unpackMaybes(options?.referralDecisions),
    "TalentRequestTrackedUserReferralDecision",
  ).map((opt) => ({
    value: opt.value,
    label: opt.label.localized ?? notAvailable,
  }));

  const selectionDecisionOptions = narrowEnumType(
    unpackMaybes(options?.selectionDecisions),
    "TalentRequestTrackedUserSelectionDecision",
  ).map((opt) => ({
    value: opt.value,
    label: opt.label.localized ?? notAvailable,
  }));

  const notReferredReasonOptions = narrowEnumType(
    unpackMaybes(options?.notReferredReasons),
    "TalentRequestTrackedUserNotReferredReason",
  ).map((opt) => ({
    value: opt.value,
    label: opt.label.localized ?? notAvailable,
  }));

  const notSelectedReasonOptions = narrowEnumType(
    unpackMaybes(options?.notSelectedReasons),
    "TalentRequestTrackedUserNotSelectedReason",
  ).map((opt) => ({
    value: opt.value,
    label: opt.label.localized ?? notAvailable,
  }));

  return (
    <div className="flex flex-col gap-y-6">
      <Select
        id="referralDecision"
        name="referralDecision"
        label={intl.formatMessage({
          defaultMessage: "Tracking status",
          id: "S40Q+f",
          description:
            "Label for the referral decision select in the referral dialog",
        })}
        nullSelection={intl.formatMessage(uiMessages.nullSelectionOption)}
        rules={{ required: intl.formatMessage(errorMessages.required) }}
        options={referralDecisionOptions}
      />
      {referralDecision ===
        TalentRequestTrackedUserReferralDecision.NotReferred && (
        <Select
          id="notReferredReason"
          name="notReferredReason"
          label={intl.formatMessage({
            defaultMessage: "Not referred details",
            id: "oQwEoy",
            description:
              "Label for the not referred reason select in the referral dialog",
          })}
          nullSelection={intl.formatMessage(uiMessages.nullSelectionOption)}
          rules={{ required: intl.formatMessage(errorMessages.required) }}
          options={notReferredReasonOptions}
        />
      )}
      {showSelectionDecision &&
        referralDecision ===
          TalentRequestTrackedUserReferralDecision.Referred && (
          <>
            <Select
              id="selectionDecision"
              name="selectionDecision"
              label={intl.formatMessage({
                defaultMessage: "Selection choice",
                id: "j/sEfU",
                description:
                  "Label for the selection decision select in the referral dialog",
              })}
              nullSelection={intl.formatMessage(uiMessages.nullSelectionOption)}
              options={selectionDecisionOptions}
            />
            {selectionDecision ===
              TalentRequestTrackedUserSelectionDecision.NotSelected && (
              <Select
                id="notSelectedReason"
                name="notSelectedReason"
                label={intl.formatMessage({
                  defaultMessage: "Not selected details",
                  id: "WHhU4F",
                  description:
                    "Label for the not selected reason select in the referral dialog",
                })}
                nullSelection={intl.formatMessage(
                  uiMessages.nullSelectionOption,
                )}
                rules={{ required: intl.formatMessage(errorMessages.required) }}
                options={notSelectedReasonOptions}
              />
            )}
            {selectionDecision ===
              TalentRequestTrackedUserSelectionDecision.Selected && (
              <Notice.Root>
                <Notice.Title>
                  {intl.formatMessage({
                    defaultMessage: "Selected candidate",
                    id: "6grvzD",
                    description:
                      "Title of the notice shown when a tracked user is selected for hiring",
                  })}
                </Notice.Title>
                <Notice.Content>
                  <p>
                    {intl.formatMessage({
                      defaultMessage: "This candidate was selected for hiring.",
                      id: "KgOIh/",
                      description:
                        "Content of the notice shown when a tracked user is selected for hiring",
                    })}
                  </p>
                </Notice.Content>
              </Notice.Root>
            )}
          </>
        )}
    </div>
  );
};

export default ReferralFormFields;
