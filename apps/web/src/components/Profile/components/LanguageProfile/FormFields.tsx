import { useIntl } from "react-intl";

import type { FieldLabels } from "@gc-digital-talent/forms";
import {
  Checklist,
  localizedEnumToOptions,
  RadioGroup,
} from "@gc-digital-talent/forms";
import { errorMessages } from "@gc-digital-talent/i18n";
import type { FragmentType } from "@gc-digital-talent/graphql";
import { getFragment } from "@gc-digital-talent/graphql";
import { CardSeparator } from "@gc-digital-talent/ui";

import { getConsideredLangItems } from "~/utils/languageUtils";

import useDirtyFields from "../../hooks/useDirtyFields";
import ConsideredLanguages, {
  LanguageProfileOptions_Fragment,
} from "./ConsideredLanguages";

interface FormFieldProps {
  labels: FieldLabels;
  optionsQuery?: FragmentType<typeof LanguageProfileOptions_Fragment>;
  setLanguagePresetNoticeIsVisible: (isVisible: boolean) => void;
}

const FormFields = ({
  labels,
  optionsQuery,
  setLanguagePresetNoticeIsVisible,
}: FormFieldProps) => {
  const intl = useIntl();
  const consideredLangOptions = getConsideredLangItems(intl);
  useDirtyFields("language");

  const options = getFragment(LanguageProfileOptions_Fragment, optionsQuery);

  const languageOptions = localizedEnumToOptions(options?.languages, intl);

  // once they open the form we can remove the helper message
  setLanguagePresetNoticeIsVisible(false);

  return (
    <div className="flex flex-col gap-6">
      <p>
        {intl.formatMessage({
          defaultMessage:
            "This section of your applicant profile focuses on the official languages you want to work in, as well as the official languages you would prefer to be tested in.",
          id: "5csRb4",
          description: "Introduction for the language profile form",
        })}
      </p>
      <Checklist
        idPrefix="considered-position-languages"
        legend={labels.consideredPositionLanguages}
        name="consideredPositionLanguages"
        id="consideredPositionLanguages"
        rules={{
          required: intl.formatMessage(errorMessages.required),
        }}
        items={consideredLangOptions}
      />
      <ConsideredLanguages labels={labels} optionsQuery={optionsQuery} />
      <CardSeparator space="none" />
      <div className="grid gap-6 sm:grid-cols-2">
        <RadioGroup
          id="preferredLanguageForInterview"
          legend={labels.prefSpokenInterviewLang}
          idPrefix="preferredLanguageForInterview"
          name="preferredLanguageForInterview"
          rules={{ required: intl.formatMessage(errorMessages.required) }}
          items={languageOptions}
        />
        <RadioGroup
          id="preferredLanguageForExam"
          legend={labels.prefWrittenExamLang}
          idPrefix="preferredLanguageForExam"
          name="preferredLanguageForExam"
          rules={{ required: intl.formatMessage(errorMessages.required) }}
          items={languageOptions}
        />
      </div>
    </div>
  );
};

export default FormFields;
