import React from "react";
import { useIntl } from "react-intl";

import { commonMessages } from "@gc-digital-talent/i18n";

import ToggleForm from "~/components/ToggleForm/ToggleForm";
import processMessages from "~/messages/processMessages";

import { DisplayProps } from "../../types";

const Display = ({ pool, subtitle }: DisplayProps) => {
  const intl = useIntl();
  const notProvided = intl.formatMessage(commonMessages.notProvided);
  const { specialNote } = pool;

  return (
    <>
      <p data-h2-margin-bottom="base(x1)">{subtitle}</p>
      <div
        data-h2-display="base(grid)"
        data-h2-gap="base(x1)"
        data-h2-grid-template-columns="p-tablet(repeat(2, 1fr))"
      >
        <ToggleForm.FieldDisplay
          hasError={!specialNote?.en}
          label={intl.formatMessage(processMessages.specialNoteEn)}
        >
          {specialNote?.en || notProvided}
        </ToggleForm.FieldDisplay>
        <ToggleForm.FieldDisplay
          hasError={!specialNote?.fr}
          label={intl.formatMessage(processMessages.specialNoteFr)}
        >
          {specialNote?.fr || notProvided}
        </ToggleForm.FieldDisplay>
      </div>
    </>
  );
};

export default Display;
