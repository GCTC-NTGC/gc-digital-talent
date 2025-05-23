import { useIntl } from "react-intl";

import { commonMessages } from "@gc-digital-talent/i18n";
import { EditPoolKeyTasksFragment } from "@gc-digital-talent/graphql";
import RichTextRenderer from "@gc-digital-talent/forms/RichTextRenderer";
import { htmlToRichTextJSON } from "@gc-digital-talent/forms/utils";

import ToggleForm from "~/components/ToggleForm/ToggleForm";
import processMessages from "~/messages/processMessages";

import { DisplayProps } from "../../types";

const Display = ({
  pool,
  subtitle,
}: DisplayProps<EditPoolKeyTasksFragment>) => {
  const intl = useIntl();
  const notProvided = intl.formatMessage(commonMessages.notProvided);
  const { keyTasks } = pool;

  return (
    <>
      {subtitle && <p data-h2-margin-bottom="base(x1)">{subtitle}</p>}
      <div
        data-h2-display="base(grid)"
        data-h2-gap="base(x1)"
        data-h2-grid-template-columns="p-tablet(repeat(2, 1fr))"
      >
        <ToggleForm.FieldDisplay
          hasError={!keyTasks?.en}
          label={intl.formatMessage(processMessages.keyTasksEn)}
        >
          {keyTasks?.en ? (
            <RichTextRenderer node={htmlToRichTextJSON(keyTasks?.en)} />
          ) : (
            notProvided
          )}
        </ToggleForm.FieldDisplay>
        <ToggleForm.FieldDisplay
          hasError={!keyTasks?.fr}
          label={intl.formatMessage(processMessages.keyTasksFr)}
        >
          {keyTasks?.fr ? (
            <RichTextRenderer node={htmlToRichTextJSON(keyTasks?.fr)} />
          ) : (
            notProvided
          )}
        </ToggleForm.FieldDisplay>
      </div>
    </>
  );
};

export default Display;
