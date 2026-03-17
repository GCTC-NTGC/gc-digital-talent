import { useFormContext } from "react-hook-form";
import { useIntl } from "react-intl";
import { useEffect } from "react";

import {
  FragmentType,
  getFragment,
  graphql,
  ReferralPauseLength,
} from "@gc-digital-talent/graphql";
import {
  errorMessages,
  sortLocalizedEnumOptions,
  ENUM_SORT_ORDER,
  narrowEnumType,
  commonMessages,
  Locales,
  getLocale,
} from "@gc-digital-talent/i18n";
import { unpackMaybes } from "@gc-digital-talent/helpers";
import {
  Checkbox,
  DateInput,
  Select,
  TextArea,
} from "@gc-digital-talent/forms";
import { strToFormDate } from "@gc-digital-talent/date-helpers";

import { FRENCH_WORDS_PER_ENGLISH_WORD } from "~/constants/talentSearchConstants";

import { FormValues } from "../types";

export const PauseReferralFormFields_Fragment = graphql(/* GraphQL */ `
  fragment PauseReferralFormFields on Query {
    referralPauseLengths: localizedEnumOptions(
      enumName: "ReferralPauseLength"
    ) {
      ... on LocalizedReferralPauseLength {
        value
        label {
          localized
        }
      }
    }
  }
`);

const PauseReferralFormMeta_Fragment = graphql(/** GraphQL */ `
  fragment PauseReferralFormMeta on PoolCandidate {
    id
    expiryDate
  }
`);

const TEXT_AREA_ROWS = 3;
const TEXT_AREA_MAX_WORDS_EN = 200;

interface PauseReferralFormFieldsProps {
  optionsQuery?: FragmentType<typeof PauseReferralFormFields_Fragment>;
  metaQuery?: FragmentType<typeof PauseReferralFormMeta_Fragment>;
}

const PauseReferralFormFields = ({
  optionsQuery,
  metaQuery,
}: PauseReferralFormFieldsProps) => {
  const intl = useIntl();
  const locale = getLocale(intl);
  const options = getFragment(PauseReferralFormFields_Fragment, optionsQuery);

  const application = getFragment(PauseReferralFormMeta_Fragment, metaQuery);

  const { watch, resetField } = useFormContext<FormValues>();
  const pauseStatus = watch("referralPauseStatus");
  const pauseLength = watch("referralPauseLength");
  const expiryDate = application?.expiryDate ?? watch("expiryDate");

  const notAvailable = intl.formatMessage(commonMessages.notAvailable);

  const referralPauseLengthOptions = sortLocalizedEnumOptions(
    ENUM_SORT_ORDER.REFERRAL_PAUSE_LENGTH,
    narrowEnumType(
      unpackMaybes(options?.referralPauseLengths),
      "ReferralPauseLength",
    ),
  ).map((referralPauseLength) => ({
    value: referralPauseLength.value,
    label: referralPauseLength.label.localized ?? notAvailable,
  }));

  /**
   * Reset all fields when employmentCategory field is changed
   */
  useEffect(() => {
    const resetDirtyField = (name: keyof FormValues) => {
      resetField(name, { keepDirty: false, defaultValue: undefined });
    };

    if (!pauseStatus) {
      resetDirtyField("referralPauseLength");
      resetDirtyField("referralPauseReason");
      resetDirtyField("referralUnpauseAt");
    }

    if (pauseLength !== ReferralPauseLength.Other) {
      resetDirtyField("referralUnpauseAt");
    }
  }, [pauseStatus, pauseLength]);

  const wordCountLimits: Record<Locales, number> = {
    en: TEXT_AREA_MAX_WORDS_EN,
    fr: Math.round(TEXT_AREA_MAX_WORDS_EN * FRENCH_WORDS_PER_ENGLISH_WORD),
  } as const;

  return (
    <>
      <Checkbox
        id="referralPauseStatus"
        name="referralPauseStatus"
        boundingBox
        boundingBoxLabel={intl.formatMessage({
          defaultMessage: "Paused referral status",
          id: "F/zEUH",
          description:
            "Bounding box label for pause referral status checkbox input",
        })}
        label={intl.formatMessage({
          defaultMessage: "Pause candidate referral",
          id: "Q/Fbat",
          description: "Label for pause referral status checkbox input",
        })}
        rules={{
          required: intl.formatMessage(errorMessages.required),
        }}
      />
      {pauseStatus && (
        <>
          <Select
            id="referralPauseLength"
            name="referralPauseLength"
            options={referralPauseLengthOptions}
            label={intl.formatMessage({
              defaultMessage: "Pause length",
              id: "eUjL9C",
              description: "Label for pause referral status select input",
            })}
            nullSelection={intl.formatMessage({
              defaultMessage: "Select a pause length",
              id: "hGBUc+",
              description: "Null selection for pause referral select input",
            })}
            rules={{
              required: intl.formatMessage(errorMessages.required),
            }}
            doNotSort
          />
          {pauseLength === ReferralPauseLength.Other && (
            <DateInput
              id="referralUnpauseAt"
              name="referralUnpauseAt"
              rules={{
                required: intl.formatMessage(errorMessages.required),
                min: {
                  value: strToFormDate(new Date().toISOString()),
                  message: intl.formatMessage(errorMessages.invalidDate),
                },
                max: {
                  value: expiryDate ? strToFormDate(expiryDate) : "",
                  message: intl.formatMessage(
                    {
                      defaultMessage:
                        "Pause end date cannot be after this candidate's pool expiry date ({date}).",
                      id: "yoSmU/",
                      description:
                        "Error message for pause referral status end date input",
                    },
                    {
                      date: expiryDate
                        ? strToFormDate(expiryDate)
                        : notAvailable,
                    },
                  ),
                },
              }}
              legend={intl.formatMessage({
                defaultMessage: "Pause referral end date",
                id: "u3ardU",
                description: "Label for pause referral status end date input",
              })}
            />
          )}
          <TextArea
            id="referralPauseReason"
            name="referralPauseReason"
            rows={TEXT_AREA_ROWS}
            wordLimit={wordCountLimits[locale]}
            label={intl.formatMessage({
              defaultMessage: "Pause reason",
              id: "Yo8gFh",
              description:
                "Label for pause referral status dialog reason input",
            })}
            rules={{
              required: intl.formatMessage(errorMessages.required),
            }}
          />
        </>
      )}
    </>
  );
};

export default PauseReferralFormFields;
