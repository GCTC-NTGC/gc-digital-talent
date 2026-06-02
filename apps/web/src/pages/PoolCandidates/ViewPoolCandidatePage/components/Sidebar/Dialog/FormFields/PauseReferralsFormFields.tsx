import { useFormContext } from "react-hook-form";
import { useIntl } from "react-intl";
import { useEffect } from "react";

import type { FragmentType } from "@gc-digital-talent/graphql";
import {
  getFragment,
  graphql,
  PauseReferralsLength,
} from "@gc-digital-talent/graphql";
import type { Locales } from "@gc-digital-talent/i18n";
import {
  errorMessages,
  sortLocalizedEnumOptions,
  ENUM_SORT_ORDER,
  narrowEnumType,
  commonMessages,
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

import type { FormValues } from "../types";

export const PauseReferralsFormFields_Fragment = graphql(/* GraphQL */ `
  fragment PauseReferralsFormFields on Query {
    pauseReferralsLengths: localizedEnumOptions(
      enumName: "PauseReferralsLength"
    ) {
      ... on LocalizedPauseReferralsLength {
        value
        label {
          localized
        }
      }
    }
  }
`);

const PauseReferralsFormMeta_Fragment = graphql(/** GraphQL */ `
  fragment PauseReferralsFormMeta on PoolCandidate {
    id
    expiryDate
  }
`);

const TEXT_AREA_ROWS = 3;
const TEXT_AREA_MAX_WORDS_EN = 200;

interface PauseReferralsFormFieldsProps {
  optionsQuery?: FragmentType<typeof PauseReferralsFormFields_Fragment>;
  metaQuery?: FragmentType<typeof PauseReferralsFormMeta_Fragment>;
  required?: boolean;
}

const PauseReferralsFormFields = ({
  optionsQuery,
  metaQuery,
  required = false,
}: PauseReferralsFormFieldsProps) => {
  const intl = useIntl();
  const locale = getLocale(intl);
  const options = getFragment(PauseReferralsFormFields_Fragment, optionsQuery);

  const application = getFragment(PauseReferralsFormMeta_Fragment, metaQuery);

  const { watch, resetField } = useFormContext<FormValues>();
  const pauseStatus = watch("referralPauseStatus");
  const pauseLength = watch("pauseReferralsLength");
  const expiryDate = application?.expiryDate ?? watch("expiryDate");

  const notAvailable = intl.formatMessage(commonMessages.notAvailable);

  const pauseReferralsLengthOptions = sortLocalizedEnumOptions(
    ENUM_SORT_ORDER.PAUSE_REFERRALS_LENGTH,
    narrowEnumType(
      unpackMaybes(options?.pauseReferralsLengths),
      "PauseReferralsLength",
    ),
  ).map((pauseReferralsLength) => ({
    value: pauseReferralsLength.value,
    label: pauseReferralsLength.label.localized ?? notAvailable,
  }));

  /**
   * Reset all fields when employmentCategory field is changed
   */
  useEffect(() => {
    const resetDirtyField = (name: keyof FormValues) => {
      resetField(name, { keepDirty: false, defaultValue: undefined });
    };

    if (!pauseStatus) {
      resetDirtyField("pauseReferralsLength");
      resetDirtyField("pauseReferralsReason");
      resetDirtyField("resumeReferralsAt");
    }

    if (pauseLength !== PauseReferralsLength.Other) {
      resetDirtyField("resumeReferralsAt");
    }
  }, [pauseStatus, pauseLength, resetField]);

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
          defaultMessage: "Referral status paused",
          id: "GIm3Iq",
          description:
            "Bounding box label for pause referral status checkbox input",
        })}
        label={intl.formatMessage({
          defaultMessage: "Pause candidate referral",
          id: "Q/Fbat",
          description: "Label for pause referral status checkbox input",
        })}
        {...(required
          ? { rules: { required: intl.formatMessage(errorMessages.required) } }
          : {})}
      />
      {pauseStatus && (
        <>
          <Select
            id="pauseReferralsLength"
            name="pauseReferralsLength"
            options={pauseReferralsLengthOptions}
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
          {pauseLength === PauseReferralsLength.Other && (
            <DateInput
              id="resumeReferralsAt"
              name="resumeReferralsAt"
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
                        "Pause end date can't be after expiry date of pool ({date}).",
                      id: "na1ci7",
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
            id="pauseReferralsReason"
            name="pauseReferralsReason"
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

export default PauseReferralsFormFields;
