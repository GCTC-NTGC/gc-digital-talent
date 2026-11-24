import { useIntl } from "react-intl";

import {
  DATE_FORMAT_LOCALIZED,
  TZ_VANCOUVER,
  formatDate,
  parseDateTimeUtc,
} from "@gc-digital-talent/date-helpers";
import type { EditPoolClosingDateFragment } from "@gc-digital-talent/graphql";
import { commonMessages } from "@gc-digital-talent/i18n";

import ToggleForm from "~/components/ToggleForm/ToggleForm";
import processMessages from "~/messages/processMessages";

import type { DisplayProps } from "../../types";

const Display = ({ pool }: DisplayProps<EditPoolClosingDateFragment>) => {
  const intl = useIntl();
  const notProvided = intl.formatMessage(commonMessages.notProvided);
  const { closingDate } = pool;

  return (
    <div className="grid gap-6 xs:grid-cols-2">
      <ToggleForm.FieldDisplay
        hasError={!closingDate}
        label={intl.formatMessage(processMessages.closingDate)}
      >
        {closingDate
          ? formatDate({
              date: parseDateTimeUtc(closingDate),
              formatString: DATE_FORMAT_LOCALIZED,
              intl,
              timeZone: TZ_VANCOUVER,
            })
          : notProvided}
      </ToggleForm.FieldDisplay>
    </div>
  );
};

export default Display;
