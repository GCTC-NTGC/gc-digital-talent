import React from "react";
import { useIntl } from "react-intl";

import { Checklist, FieldLabels } from "@gc-digital-talent/forms";
import { errorMessages } from "@gc-digital-talent/i18n";

import useDirtyFields from "../../hooks/useDirtyFields";
import ConsideredLanguages from "./ConsideredLanguages";
import { getConsideredLangItems } from "./utils";

interface FormFieldProps {
  labels: FieldLabels;
}

const FormFields = ({ labels }: FormFieldProps) => {
  const intl = useIntl();
  const consideredLangOptions = getConsideredLangItems(intl);
  useDirtyFields("language");

  return (
    <div className="flex flex-col gap-y-6">
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
      <ConsideredLanguages labels={labels} />
    </div>
  );
};

export default FormFields;
