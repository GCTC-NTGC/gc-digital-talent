import { useIntl } from "react-intl";

import { Input, TextArea } from "@gc-digital-talent/forms";
import { commonMessages, errorMessages } from "@gc-digital-talent/i18n";

import { FRENCH_WORDS_PER_ENGLISH_WORD } from "~/constants/talentSearchConstants";

const FormFields = () => {
  const intl = useIntl();

  const TEXT_AREA_MAX_WORDS_EN = 100;
  const TEXT_AREA_MAX_WORDS_FR = Math.round(
    TEXT_AREA_MAX_WORDS_EN * FRENCH_WORDS_PER_ENGLISH_WORD,
  );

  return (
    <div className="grid gap-6 xs:grid-cols-2">
      <Input
        id="name_en"
        name="name.en"
        autoComplete="off"
        label={intl.formatMessage(commonMessages.name)}
        appendLanguageToLabel={"en"}
        type="text"
        rules={{
          required: intl.formatMessage(errorMessages.required),
        }}
      />
      <Input
        id="name_fr"
        name="name.fr"
        autoComplete="off"
        label={intl.formatMessage(commonMessages.name)}
        appendLanguageToLabel={"fr"}
        type="text"
        rules={{
          required: intl.formatMessage(errorMessages.required),
        }}
      />
      <Input
        id="abbreviation_en"
        name="abbreviation.en"
        label={intl.formatMessage({
          defaultMessage: "Abbreviation",
          id: "QEwqmf",
          description: "Label displayed for abbreviation field",
        })}
        appendLanguageToLabel={"en"}
        type="text"
      />
      <Input
        id="abbreviation_fr"
        name="abbreviation.fr"
        label={intl.formatMessage({
          defaultMessage: "Abbreviation",
          id: "QEwqmf",
          description: "Label displayed for abbreviation field",
        })}
        appendLanguageToLabel={"fr"}
        type="text"
      />
      <Input
        id="informationUrl_en"
        name="informationUrl.en"
        label={intl.formatMessage({
          defaultMessage: "Official website or documentation",
          id: "eK+8dS",
          description: "Label displayed for information URL field",
        })}
        appendLanguageToLabel={"en"}
        type="url"
      />
      <Input
        id="informationUrl_fr"
        name="informationUrl.fr"
        label={intl.formatMessage({
          defaultMessage: "Official website or documentation",
          id: "eK+8dS",
          description: "Label displayed for information URL field",
        })}
        appendLanguageToLabel={"fr"}
        type="url"
      />
      <TextArea
        id="descriptionForProfile_en"
        name="descriptionForProfile.en"
        label={intl.formatMessage(commonMessages.description)}
        appendLanguageToLabel={"en"}
        rules={{
          required: intl.formatMessage(errorMessages.required),
        }}
        wordLimit={TEXT_AREA_MAX_WORDS_EN}
      />
      <TextArea
        id="descriptionForProfile_fr"
        name="descriptionForProfile.fr"
        label={intl.formatMessage(commonMessages.description)}
        appendLanguageToLabel={"fr"}
        rules={{
          required: intl.formatMessage(errorMessages.required),
        }}
        wordLimit={TEXT_AREA_MAX_WORDS_FR}
      />
    </div>
  );
};

export default FormFields;
