import { useIntl } from "react-intl";
import { useWatch } from "react-hook-form";

import {
  DATE_SEGMENT,
  DateInput,
  Input,
  RadioGroup,
  TextArea,
} from "@gc-digital-talent/forms";
import { errorMessages, getLocale, Locales } from "@gc-digital-talent/i18n";
import { strToFormDate } from "@gc-digital-talent/date-helpers";
import { nodeToString } from "@gc-digital-talent/helpers";

import {
  SubExperienceFormProps,
  CommunityFormValues,
} from "~/types/experience";
import { FRENCH_WORDS_PER_ENGLISH_WORD } from "~/constants/talentSearchConstants";
import { getExperienceFormLabels } from "~/utils/experienceUtils";

const TEXT_AREA_ROWS = 3;
const TEXT_AREA_MAX_WORDS_EN = 200;

const CommunityFields = ({
  labels,
  organizationSuggestions,
}: SubExperienceFormProps & { organizationSuggestions: string[] }) => {
  const intl = useIntl();
  const locale = getLocale(intl);
  const experienceLabels = getExperienceFormLabels(intl);
  const todayDate = new Date();
  // to toggle whether endDate is required, the state of the current-role checkbox must be monitored and have to adjust the form accordingly
  const isCurrent =
    useWatch<CommunityFormValues>({ name: "roleStatus" }) !== "past";
  // ensuring endDate isn't before startDate, using this as a minimum value
  const startDate = useWatch<CommunityFormValues>({ name: "startDate" });

  const wordCountLimits: Record<Locales, number> = {
    en: TEXT_AREA_MAX_WORDS_EN,
    fr: Math.round(TEXT_AREA_MAX_WORDS_EN * FRENCH_WORDS_PER_ENGLISH_WORD),
  } as const;

  return (
    <div className="grid gap-6">
      <Input
        id="role"
        label={intl.formatMessage({
          defaultMessage: "Role or title",
          id: "eOIwNx",
          description:
            "Label displayed on Community Experience form for role input",
        })}
        name="role"
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
      {/* conditionally render the endDate based off the state attached to the checkbox input */}
      {!isCurrent && (
        <DateInput
          id="endDate"
          legend={labels.endDate}
          name="endDate"
          round="ceil"
          show={[DATE_SEGMENT.Month, DATE_SEGMENT.Year]}
          rules={
            isCurrent && startDate
              ? {}
              : {
                  required: intl.formatMessage(errorMessages.required),
                  min: {
                    value: startDate ? String(startDate) : "",
                    message: intl.formatMessage(errorMessages.minDateLabel, {
                      label: nodeToString(labels.startDate).toLowerCase(),
                    }),
                  },
                }
          }
        />
      )}
      <Input
        id="organization"
        label={labels.organization}
        name="organization"
        type="text"
        rules={{ required: intl.formatMessage(errorMessages.required) }}
        list={
          organizationSuggestions.length ? "organizationSuggestions" : undefined
        }
      />
      {organizationSuggestions.length > 0 && (
        <datalist id="organizationSuggestions">
          {organizationSuggestions.map((suggestion) => {
            return <option key={suggestion} value={suggestion}></option>;
          })}
        </datalist>
      )}
      <Input
        id="project"
        label={labels.project}
        name="project"
        type="text"
        rules={{ required: intl.formatMessage(errorMessages.required) }}
      />
      <p>
        {intl.formatMessage({
          defaultMessage:
            "The following section should be a high-level overview focusing on what you did in the role. Try to keep this field clear and concise as you'll be able to provide more detailed information when linking skills to this experience.",
          id: "NEycpM",
          description:
            "Help text for the experience key tasks and responsibilities field",
        })}
      </p>
      <TextArea
        id={"details"}
        name={"details"}
        rows={TEXT_AREA_ROWS}
        wordLimit={wordCountLimits[locale]}
        label={experienceLabels.keyTasksAndResponsibilities}
        rules={{ required: intl.formatMessage(errorMessages.required) }}
      />
    </div>
  );
};

export default CommunityFields;
