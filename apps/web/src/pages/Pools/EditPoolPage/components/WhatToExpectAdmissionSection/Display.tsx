import { useIntl } from "react-intl";

import { commonMessages } from "@gc-digital-talent/i18n";
import { RichTextRenderer, htmlToRichTextJSON } from "@gc-digital-talent/forms";
import { EditPoolWhatToExpectAdmissionFragment } from "@gc-digital-talent/graphql";

import ToggleForm from "~/components/ToggleForm/ToggleForm";
import processMessages from "~/messages/processMessages";

import { DisplayProps } from "../../types";

const Display = ({
  pool,
  subtitle,
}: DisplayProps<EditPoolWhatToExpectAdmissionFragment>) => {
  const intl = useIntl();
  const notProvided = intl.formatMessage(commonMessages.notProvided);
  const { whatToExpectAdmission } = pool;

  return (
    <>
      {subtitle && <p className="mb-6">{subtitle}</p>}
      <div className="grid gap-6 xs:col-span-2">
        <ToggleForm.FieldDisplay
          hasError={!whatToExpectAdmission?.en}
          label={intl.formatMessage(processMessages.whatToExpect)}
          appendLanguageToLabel={"en"}
        >
          {whatToExpectAdmission?.en ? (
            <RichTextRenderer
              node={htmlToRichTextJSON(whatToExpectAdmission?.en)}
            />
          ) : (
            notProvided
          )}
        </ToggleForm.FieldDisplay>
        <ToggleForm.FieldDisplay
          hasError={!whatToExpectAdmission?.fr}
          label={intl.formatMessage(processMessages.whatToExpect)}
          appendLanguageToLabel={"fr"}
        >
          {whatToExpectAdmission?.fr ? (
            <RichTextRenderer
              node={htmlToRichTextJSON(whatToExpectAdmission?.fr)}
            />
          ) : (
            notProvided
          )}
        </ToggleForm.FieldDisplay>
      </div>
    </>
  );
};

export default Display;
