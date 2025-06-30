import { useIntl } from "react-intl";

import { commonMessages } from "@gc-digital-talent/i18n";
import { RichTextRenderer, htmlToRichTextJSON } from "@gc-digital-talent/forms";
import { EditPoolWhatToExpectFragment } from "@gc-digital-talent/graphql";

import ToggleForm from "~/components/ToggleForm/ToggleForm";
import processMessages from "~/messages/processMessages";

import { DisplayProps } from "../../types";

const Display = ({
  pool,
  subtitle,
}: DisplayProps<EditPoolWhatToExpectFragment>) => {
  const intl = useIntl();
  const notProvided = intl.formatMessage(commonMessages.notProvided);
  const { whatToExpect } = pool;

  return (
    <>
      {subtitle && <p className="mb-6">{subtitle}</p>}
      <div className="grid gap-6 xs:grid-cols-2">
        <ToggleForm.FieldDisplay
          hasError={!whatToExpect?.en}
          label={intl.formatMessage(processMessages.whatToExpectEn)}
        >
          {whatToExpect?.en ? (
            <RichTextRenderer node={htmlToRichTextJSON(whatToExpect?.en)} />
          ) : (
            notProvided
          )}
        </ToggleForm.FieldDisplay>
        <ToggleForm.FieldDisplay
          hasError={!whatToExpect?.fr}
          label={intl.formatMessage(processMessages.whatToExpectFr)}
        >
          {whatToExpect?.fr ? (
            <RichTextRenderer node={htmlToRichTextJSON(whatToExpect?.fr)} />
          ) : (
            notProvided
          )}
        </ToggleForm.FieldDisplay>
      </div>
    </>
  );
};

export default Display;
