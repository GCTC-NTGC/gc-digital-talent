import { useIntl } from "react-intl";

import { Checklist, FieldLabels } from "@gc-digital-talent/forms";
import { errorMessages } from "@gc-digital-talent/i18n";
import { FragmentType } from "@gc-digital-talent/graphql";

import { getConsideredLangItems } from "~/utils/languageUtils";

import useDirtyFields from "../../hooks/useDirtyFields";
import ConsideredLanguages, {
  LanguageProfileOptions_Fragment,
} from "./ConsideredLanguages";

interface FormFieldProps {
  labels: FieldLabels;
  optionsQuery?: FragmentType<typeof LanguageProfileOptions_Fragment>;
}

const FormFields = ({ labels, optionsQuery }: FormFieldProps) => {
  const intl = useIntl();
  const consideredLangOptions = getConsideredLangItems(intl);
  useDirtyFields("language");

  return (
    <div className="flex flex-col gap-6">
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
    </div>
  );
};

export default FormFields;
