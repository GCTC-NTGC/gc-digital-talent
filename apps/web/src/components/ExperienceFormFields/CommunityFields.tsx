import { useIntl } from "react-intl";
import { useWatch } from "react-hook-form";

import {
  Checkbox,
  DATE_SEGMENT,
  DateInput,
  Input,
  TextArea,
} from "@gc-digital-talent/forms";
import { errorMessages, getLocale, Locales } from "@gc-digital-talent/i18n";
import { strToFormDate } from "@gc-digital-talent/date-helpers";
import { nodeToString } from "@gc-digital-talent/helpers";
import { Heading } from "@gc-digital-talent/ui";

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
  const isCurrent = useWatch<CommunityFormValues>({ name: "currentRole" });
  // ensuring endDate isn't before startDate, using this as a minimum value
  const startDate = useWatch<CommunityFormValues>({ name: "startDate" });

  const wordCountLimits: Record<Locales, number> = {
    en: TEXT_AREA_MAX_WORDS_EN,
    fr: Math.round(TEXT_AREA_MAX_WORDS_EN * FRENCH_WORDS_PER_ENGLISH_WORD),
  } as const;

  return (
    <>
      <div className="grid gap-6 xs:grid-cols-2">
        <div>
          <Input
            id="role"
            label={labels.role}
            name="role"
            type="text"
            rules={{ required: intl.formatMessage(errorMessages.required) }}
          />
        </div>
        <div>
          <Checkbox
            boundingBox
            boundingBoxLabel={labels.currentRole}
            id="currentRole"
            label={intl.formatMessage({
              defaultMessage: "I am currently active in this role",
              id: "mOx5K1",
              description: "Label displayed for current role input",
            })}
            name="currentRole"
          />
        </div>
        <div>
          <Input
            id="organization"
            label={labels.organization}
            name="organization"
            type="text"
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
        </div>
        <div>
          <Input
            id="project"
            label={labels.project}
            name="project"
            type="text"
            rules={{ required: intl.formatMessage(errorMessages.required) }}
          />
        </div>
        <div>
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
        </div>
        <div>
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
                        message: intl.formatMessage(
                          errorMessages.minDateLabel,
                          {
                            label: nodeToString(labels.startDate).toLowerCase(),
                          },
                        ),
                      },
                    }
              }
            />
          )}
        </div>
      </div>
      <Heading level="h3" size="h4" className="mt-18 mb-6 font-bold">
        {intl.formatMessage({
          defaultMessage: "Highlight additional details",
          id: "6v+j79",
          description: "Title for additional details section",
        })}
      </Heading>
      <div>
        <p className="mb-6">
          {intl.formatMessage({
            defaultMessage:
              "Describe <strong>key tasks</strong>, <strong>responsibilities</strong>, or <strong>other information</strong> you feel were crucial in making this experience important. Try to keep this field concise as you'll be able to provide more detailed information when linking skills to this experience.",
            id: "yZ0kfQ",
            description:
              "Help text for the experience additional details field",
          })}
        </p>
        <TextArea
          id={"details"}
          name={"details"}
          rows={TEXT_AREA_ROWS}
          wordLimit={wordCountLimits[locale]}
          label={experienceLabels.details}
          rules={{ required: intl.formatMessage(errorMessages.required) }}
        />
      </div>
    </>
  );
};

export default CommunityFields;
