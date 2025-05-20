import { useIntl } from "react-intl";

import { commonMessages } from "@gc-digital-talent/i18n";
import { Well } from "@gc-digital-talent/ui";
import { EditPoolSpecialNoteFragment } from "@gc-digital-talent/graphql";
import RichTextRenderer from "@gc-digital-talent/forms/RichTextRenderer";
import { htmlToRichTextJSON } from "@gc-digital-talent/forms/utils";

import ToggleForm from "~/components/ToggleForm/ToggleForm";
import processMessages from "~/messages/processMessages";

import { DisplayProps } from "../../types";
import { hasAllEmptyFields } from "../../../../../validators/process/specialNote";

const Display = ({
  pool,
  subtitle,
}: DisplayProps<EditPoolSpecialNoteFragment>) => {
  const intl = useIntl();
  const notProvided = intl.formatMessage(commonMessages.notProvided);
  const isNull = hasAllEmptyFields(pool);
  const { specialNote } = pool;

  return (
    <>
      {subtitle && <p data-h2-margin-bottom="base(x1)">{subtitle}</p>}
      {!isNull ? (
        <div
          data-h2-display="base(grid)"
          data-h2-gap="base(x1)"
          data-h2-grid-template-columns="p-tablet(repeat(2, 1fr))"
        >
          <ToggleForm.FieldDisplay
            hasError={!specialNote?.en}
            label={intl.formatMessage(processMessages.specialNoteEn)}
          >
            {specialNote?.en ? (
              <RichTextRenderer node={htmlToRichTextJSON(specialNote?.en)} />
            ) : (
              notProvided
            )}
          </ToggleForm.FieldDisplay>
          <ToggleForm.FieldDisplay
            hasError={!specialNote?.fr}
            label={intl.formatMessage(processMessages.specialNoteFr)}
          >
            {specialNote?.fr ? (
              <RichTextRenderer node={htmlToRichTextJSON(specialNote?.fr)} />
            ) : (
              notProvided
            )}
          </ToggleForm.FieldDisplay>
        </div>
      ) : (
        <Well>
          {intl.formatMessage({
            defaultMessage:
              "This advertisement does not require a special note.",
            id: "3Bcg0F",
            description:
              "Message displayed when there is no special note for a process advertisement.",
          })}
        </Well>
      )}
    </>
  );
};

export default Display;
