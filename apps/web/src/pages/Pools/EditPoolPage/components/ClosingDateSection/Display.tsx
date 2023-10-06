import React from "react";
import { useIntl } from "react-intl";

import { commonMessages } from "@gc-digital-talent/i18n";

import ToggleForm from "~/components/ToggleForm/ToggleForm";
import processMessages from "~/messages/processMessages";
import { formatClosingDate } from "~/utils/poolUtils";

import { DisplayProps } from "../../types";

const Display = ({ pool, subtitle }: DisplayProps) => {
  const intl = useIntl();
  const notProvided = intl.formatMessage(commonMessages.notProvided);
  const { closingDate } = pool;
  const dates = formatClosingDate(closingDate, intl);

  return (
    <>
      <p data-h2-margin-bottom="base(x1)">{subtitle}</p>
      <div
        data-h2-display="base(grid)"
        data-h2-gap="base(x1)"
        data-h2-grid-template-columns="p-tablet(repeat(2, 1fr))"
      >
        <ToggleForm.FieldDisplay
          hasError={!closingDate}
          label={intl.formatMessage(processMessages.closingDatePacific)}
        >
          {closingDate ? dates.pacific : notProvided}
        </ToggleForm.FieldDisplay>
        <ToggleForm.FieldDisplay
          hasError={!closingDate}
          label={intl.formatMessage(processMessages.closingDateLocal)}
        >
          {closingDate ? dates.local : notProvided}
        </ToggleForm.FieldDisplay>
      </div>
    </>
  );
};

export default Display;
