import { useIntl } from "react-intl";

import { commonMessages } from "@gc-digital-talent/i18n";
import { formatDate, parseDateTimeUtc } from "@gc-digital-talent/date-helpers";
import { EditPoolClosingDateFragment } from "@gc-digital-talent/graphql";

import ToggleForm from "~/components/ToggleForm/ToggleForm";
import processMessages from "~/messages/processMessages";

const Display = ({ pool }: { pool: EditPoolClosingDateFragment }) => {
  const intl = useIntl();
  const notProvided = intl.formatMessage(commonMessages.notProvided);
  const { closingDate } = pool;

  return (
    <div
      data-h2-display="base(grid)"
      data-h2-gap="base(x1)"
      data-h2-grid-template-columns="p-tablet(repeat(2, 1fr))"
    >
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
