import React from "react";
import { useIntl } from "react-intl";

import { commonMessages } from "@gc-digital-talent/i18n";
import {
  DATE_FORMAT_STRING,
  formatDate,
  parseDateTimeUtc,
} from "@gc-digital-talent/date-helpers";

import ToggleForm from "~/components/ToggleForm/ToggleForm";
import processMessages from "~/messages/processMessages";

import { DisplayProps } from "../../types";

const Display = ({ pool, subtitle }: DisplayProps) => {
  const intl = useIntl();
  const notProvided = intl.formatMessage(commonMessages.notProvided);
  const { closingDate } = pool;

  return (
    <>
      <p data-h2-margin-bottom="base(x1)">{subtitle}</p>
      <ToggleForm.FieldDisplay
        hasError={!closingDate}
        label={intl.formatMessage(processMessages.closingDate)}
      >
        {closingDate
          ? formatDate({
              date: parseDateTimeUtc(closingDate),
              intl,
              formatString: DATE_FORMAT_STRING,
            })
          : notProvided}
      </ToggleForm.FieldDisplay>
    </>
  );
};

export default Display;
