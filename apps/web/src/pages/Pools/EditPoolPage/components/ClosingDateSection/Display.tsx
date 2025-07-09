import { useIntl } from "react-intl";

import { commonMessages } from "@gc-digital-talent/i18n";
import { formatDate, parseDateTimeUtc } from "@gc-digital-talent/date-helpers";
import { EditPoolClosingDateFragment } from "@gc-digital-talent/graphql";

import ToggleForm from "~/components/ToggleForm/ToggleForm";
import processMessages from "~/messages/processMessages";

import { DisplayProps } from "../../types";

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
              formatString: "PPP",
              intl,
              timeZone: "Canada/Pacific",
            })
          : notProvided}
      </ToggleForm.FieldDisplay>
    </div>
  );
};

export default Display;
