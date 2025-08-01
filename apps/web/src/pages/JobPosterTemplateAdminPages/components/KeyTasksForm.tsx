import { useIntl } from "react-intl";

import { RichTextInput } from "@gc-digital-talent/forms";
import { errorMessages, Locales } from "@gc-digital-talent/i18n";

import { FRENCH_WORDS_PER_ENGLISH_WORD } from "~/constants/talentSearchConstants";
import jobPosterTemplateMessages from "~/messages/jobPosterTemplateMessages";

const TEXT_AREA_MAX_WORDS_EN = 200;

const keyTasksWordCountLimits: Record<Locales, number> = {
  en: TEXT_AREA_MAX_WORDS_EN,
  fr: Math.round(TEXT_AREA_MAX_WORDS_EN * FRENCH_WORDS_PER_ENGLISH_WORD),
} as const;

export interface FormValues {
  keyTasksEn: string | null;
  keyTasksFr: string | null;
}

const KeyTasksForm = () => {
  const intl = useIntl();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <RichTextInput
          id="keyTasksEn"
          name="keyTasksEn"
          wordLimit={keyTasksWordCountLimits.en}
          label={intl.formatMessage(jobPosterTemplateMessages.keyTasks)}
          rules={{
            required: intl.formatMessage(errorMessages.required),
          }}
          appendLanguageToLabel="en"
        />
      </div>
      <div>
        <RichTextInput
          id="keyTasksFr"
          name="keyTasksFr"
          wordLimit={keyTasksWordCountLimits.fr}
          label={intl.formatMessage(jobPosterTemplateMessages.keyTasks)}
          rules={{
            required: intl.formatMessage(errorMessages.required),
          }}
          appendLanguageToLabel="fr"
        />
      </div>
    </div>
  );
};

export default KeyTasksForm;
