import { useIntl } from "react-intl";

import { commonMessages } from "@gc-digital-talent/i18n";
import { Well } from "@gc-digital-talent/ui";
import { RichTextRenderer, htmlToRichTextJSON } from "@gc-digital-talent/forms";

import ToggleForm from "~/components/ToggleForm/ToggleForm";
import processMessages from "~/messages/processMessages";

import { DisplayProps } from "../../types";
import { hasAllEmptyFields } from "../../../../../validators/process/specialNote";

const Display = ({ pool, subtitle }: DisplayProps) => {
  const intl = useIntl();
  const notProvided = intl.formatMessage(commonMessages.notProvided);
  const isNull = hasAllEmptyFields(pool);
  const { specialNote } = pool;

  return (
    <>
      {subtitle && <p className="mb-6">{subtitle}</p>}
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
