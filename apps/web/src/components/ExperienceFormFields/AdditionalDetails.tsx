import { useWatch } from "react-hook-form";
import { useIntl } from "react-intl";

import { errorMessages, getLocale, Locales } from "@gc-digital-talent/i18n";
import { TextArea } from "@gc-digital-talent/forms";
import { Heading } from "@gc-digital-talent/ui";

import { AllExperienceFormValues, ExperienceType } from "~/types/experience";
import { getExperienceFormLabels } from "~/utils/experienceUtils";
import { FRENCH_WORDS_PER_ENGLISH_WORD } from "~/constants/talentSearchConstants";

import NullExperienceType from "./NullExperienceType";

const TEXT_AREA_ROWS = 3;
const TEXT_AREA_MAX_WORDS_EN = 200;
const FIELD_NAME = "details";

interface AdditionalDetailsProps {
  experienceType?: ExperienceType;
}

const AdditionalDetails = ({ experienceType }: AdditionalDetailsProps) => {
  const intl = useIntl();
  const locale = getLocale(intl);
  const experienceLabels = getExperienceFormLabels(intl);
  const type = useWatch<AllExperienceFormValues>({ name: "experienceType" });
  const derivedType = type ?? experienceType;

  const wordCountLimits: Record<Locales, number> = {
    en: TEXT_AREA_MAX_WORDS_EN,
    fr: Math.round(TEXT_AREA_MAX_WORDS_EN * FRENCH_WORDS_PER_ENGLISH_WORD),
  } as const;

  return (
    <>
      <Heading level="h3" size="h4" className="mt-18 mb-6 font-bold">
        {intl.formatMessage({
          defaultMessage: "Highlight additional details",
          id: "6v+j79",
          description: "Title for additional details section",
        })}
      </Heading>
      <div>
        {derivedType ? (
          <>
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
              id={FIELD_NAME}
              name={FIELD_NAME}
              rows={TEXT_AREA_ROWS}
              wordLimit={wordCountLimits[locale]}
              label={experienceLabels.details}
              rules={{ required: intl.formatMessage(errorMessages.required) }}
            />
          </>
        ) : (
          <NullExperienceType />
        )}
      </div>
    </>
  );
};

export default AdditionalDetails;
