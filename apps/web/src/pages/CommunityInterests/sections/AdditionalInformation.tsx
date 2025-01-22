import { useIntl } from "react-intl";
import ClipboardDocumentCheckIcon from "@heroicons/react/24/outline/ClipboardDocumentCheckIcon";

import { Heading } from "@gc-digital-talent/ui";
import { RichTextInput } from "@gc-digital-talent/forms";
import { getLocale } from "@gc-digital-talent/i18n";

import { FRENCH_WORDS_PER_ENGLISH_WORD } from "~/constants/talentSearchConstants";

const TEXT_AREA_MAX_WORDS_EN = 100;
const TEXT_AREA_MAX_WORDS_FR = Math.round(
  TEXT_AREA_MAX_WORDS_EN * FRENCH_WORDS_PER_ENGLISH_WORD,
);

export interface SubformValues {
  additionalInformation: string | null | undefined;
}

// interface AdditionalInformationProps {
// formDisabled: boolean; // RichTextInput can't be disabled: #12531
// }

const AdditionalInformation = () => {
  const intl = useIntl();
  const locale = getLocale(intl);

  const wordLimits = {
    en: TEXT_AREA_MAX_WORDS_EN,
    fr: TEXT_AREA_MAX_WORDS_FR,
  } as const;

  return (
    <div
      data-h2-display="base(flex)"
      data-h2-flex-direction="base(column)"
      data-h2-gap="base(x1.25)"
    >
      {/* heading and description */}
      <div
        data-h2-display="base(flex)"
        data-h2-flex-direction="base(column)"
        data-h2-gap="base(x1)"
      >
        <Heading
          level="h2"
          data-h2-font-weight="base(400)"
          Icon={ClipboardDocumentCheckIcon}
          color="primary"
          data-h2-margin="base(0)"
        >
          {intl.formatMessage({
            defaultMessage: "Additional information",
            id: "JFFBhZ",
            description: "Heading for the 'Additional information' section",
          })}
        </Heading>
        <span>
          {intl.formatMessage({
            defaultMessage:
              "In some cases, a functional community might have domain-specific questions that will help them better understand how you fit into roles within that community. This section also provides you with an opportunity to describe any other relevant information you might want to offer about yourself or your fit.",
            id: "YiC/Xi",
            description: "Description of the 'Additional information' section",
          })}
        </span>
      </div>
      {/* form */}
      <div
        data-h2-display="base(flex)"
        data-h2-flex-direction="base(column)"
        data-h2-gap="base(x1.25)"
      >
        <RichTextInput
          id="additionalInformation"
          name="additionalInformation"
          label={intl.formatMessage({
            defaultMessage: "Additional information",
            id: "i37tmL",
            description:
              "Description for a form input for adding Additional information",
          })}
          wordLimit={wordLimits[locale]}
        />
      </div>
    </div>
  );
};

export default AdditionalInformation;
