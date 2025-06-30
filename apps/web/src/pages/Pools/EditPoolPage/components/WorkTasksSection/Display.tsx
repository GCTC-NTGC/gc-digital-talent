import { useIntl } from "react-intl";

import { commonMessages } from "@gc-digital-talent/i18n";
import { RichTextRenderer, htmlToRichTextJSON } from "@gc-digital-talent/forms";
import { EditPoolKeyTasksFragment } from "@gc-digital-talent/graphql";

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
      {subtitle && <p className="mb-6">{subtitle}</p>}
      <div className="grid gap-6 xs:grid-cols-2">
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
