import { useEffect } from "react";
import { useIntl } from "react-intl";
import { useFormContext, useWatch } from "react-hook-form";

import {
  Checkbox,
  DATE_SEGMENT,
  DateInput,
  Input,
  RadioGroup,
  TextArea,
} from "@gc-digital-talent/forms";
import {
  commonMessages,
  errorMessages,
  getLocale,
  Locales,
} from "@gc-digital-talent/i18n";
import { strToFormDate } from "@gc-digital-talent/date-helpers";
import { nodeToString } from "@gc-digital-talent/helpers";

import { PersonalFormValues, SubExperienceFormProps } from "~/types/experience";
import { FRENCH_WORDS_PER_ENGLISH_WORD } from "~/constants/talentSearchConstants";

const TEXT_AREA_ROWS = 3;
const TEXT_AREA_MAX_WORDS_EN = 300;

const PersonalFields = ({
  labels,
  organizationSuggestions,
}: SubExperienceFormProps & { organizationSuggestions: string[] }) => {
  const intl = useIntl();
  const locale = getLocale(intl);
  const todayDate = new Date();
  const {
    setValue,
    formState: { defaultValues },
  } = useFormContext<PersonalFormValues>();
  // to toggle whether End date is required, the state of the Current role checkbox must be monitored and have to adjust the form accordingly
  const isCurrent =
    useWatch<PersonalFormValues>({ name: "roleStatus" }) !== "past";
  // ensuring end date isn't before the start date, using this as a minimum value
  const watchStartDate = useWatch<PersonalFormValues>({ name: "startDate" });
  const watchDescription = useWatch<PersonalFormValues>({
    name: "learningDescription",
  });

  const wordCountLimits: Record<Locales, number> = {
    en: TEXT_AREA_MAX_WORDS_EN,
    fr: Math.round(TEXT_AREA_MAX_WORDS_EN * FRENCH_WORDS_PER_ENGLISH_WORD),
  } as const;

  useEffect(() => {
    if (watchDescription !== defaultValues?.learningDescription) {
      setValue("disclaimer", false);
    }
  }, [defaultValues?.learningDescription, setValue, watchDescription]);

  return (
    <>
      <div className="mt-6 flex flex-col gap-y-6">
        <Input
          id="experienceTitle"
          label={labels.projectOrRole}
          name="experienceTitle"
          type="text"
          rules={{ required: intl.formatMessage(errorMessages.required) }}
        />
        <RadioGroup
          idPrefix="roleStatus"
          name="roleStatus"
          legend={labels.roleStatus}
          items={[
            {
              value: "active",
              label: labels.activeRole,
            },
            {
              value: "past",
              label: labels.pastRole,
            },
          ]}
          rules={{ required: intl.formatMessage(errorMessages.required) }}
        />
        <DateInput
          id="startDate"
          legend={labels.startDate}
          name="startDate"
          round="floor"
          show={[DATE_SEGMENT.Month, DATE_SEGMENT.Year]}
          rules={{
            required: intl.formatMessage(errorMessages.required),
            max: {
              value: strToFormDate(todayDate.toISOString()),
              message: intl.formatMessage(errorMessages.mustNotBeFuture),
            },
          }}
        />
        {/* conditionally render the endDate based off the state attached to the radiogroup input */}
        {!isCurrent && (
          <DateInput
            id="endDate"
            legend={labels.endDate}
            name="endDate"
            round="ceil"
            show={[DATE_SEGMENT.Month, DATE_SEGMENT.Year]}
            rules={{
              required: intl.formatMessage(errorMessages.required),
              min: {
                value: watchStartDate ? String(watchStartDate) : "",
                message: intl.formatMessage(errorMessages.minDateLabel, {
                  label: nodeToString(labels.startDate).toLowerCase(),
                }),
              },
            }}
          />
        )}
        <Input
          id="organization"
          label={labels.organizationOrPlatform}
          name="organization"
          type="text"
          placeholder={intl.formatMessage(commonMessages.selectOrTypeAnswer)}
          context={intl.formatMessage({
            defaultMessage:
              "Unsure how to complete this field? Try to describe the overarching theme this experience falls into. Remember that this field is used to group similar items in your personal learning.",
            id: "pyUCrH",
            description: "Input context for personal experience organization",
          })}
          rules={{ required: intl.formatMessage(errorMessages.required) }}
          list={
            organizationSuggestions.length
              ? "organizationSuggestions"
              : undefined
          }
        />
        {organizationSuggestions.length > 0 && (
          <datalist id="organizationSuggestions">
            {organizationSuggestions.map((suggestion) => {
              return <option key={suggestion} value={suggestion}></option>;
            })}
          </datalist>
        )}
        <p>
          {intl.formatMessage({
            defaultMessage:
              "Please describe the experience, what you've learned, and any of the tasks and responsibilities you might have had.",
            id: "pFxxMJ",
            description:
              "Descriptive sentence before experience description input",
          })}
        </p>
        <TextArea
          id="learningDescription"
          label={labels.learningDescription}
          name="learningDescription"
          rows={TEXT_AREA_ROWS}
          wordLimit={wordCountLimits[locale]}
          rules={{ required: intl.formatMessage(errorMessages.required) }}
        />
        <Checkbox
          boundingBox
          boundingBoxLabel={labels.disclaimer}
          id="disclaimer"
          label={intl.formatMessage({
            defaultMessage:
              "I agree to share this information with verified Government of Canada hiring managers and HR advisors who have access to this platform.",
            id: "oURESC",
            description:
              "Label displayed on Personal Experience form for disclaimer checkbox",
          })}
          name="disclaimer"
          rules={{ required: intl.formatMessage(errorMessages.required) }}
        />
      </div>
    </>
  );
};

export default PersonalFields;
