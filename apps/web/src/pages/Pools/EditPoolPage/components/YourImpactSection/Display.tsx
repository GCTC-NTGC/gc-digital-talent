import { useIntl } from "react-intl";

import { commonMessages } from "@gc-digital-talent/i18n";
import { RichTextRenderer, htmlToRichTextJSON } from "@gc-digital-talent/forms";
import { EditPoolYourImpactFragment } from "@gc-digital-talent/graphql";

import ToggleForm from "~/components/ToggleForm/ToggleForm";
import processMessages from "~/messages/processMessages";

import { DisplayProps } from "../../types";

const Display = ({
  pool,
  subtitle,
}: DisplayProps<EditPoolYourImpactFragment>) => {
  const intl = useIntl();
  const notProvided = intl.formatMessage(commonMessages.notProvided);
  const { yourImpact } = pool;

  return (
    <>
      {subtitle && <p className="mb-6">{subtitle}</p>}
      <div className="grid gap-6 xs:grid-cols-2">
        <ToggleForm.FieldDisplay
          hasError={!yourImpact?.en}
          label={intl.formatMessage(processMessages.yourImpactEn)}
        >
          {yourImpact?.en ? (
            <RichTextRenderer node={htmlToRichTextJSON(yourImpact?.en)} />
          ) : (
            notProvided
          )}
        </ToggleForm.FieldDisplay>
        <ToggleForm.FieldDisplay
          hasError={!yourImpact?.fr}
          label={intl.formatMessage(processMessages.yourImpactFr)}
        >
          {yourImpact?.fr ? (
            <RichTextRenderer node={htmlToRichTextJSON(yourImpact?.fr)} />
          ) : (
            notProvided
          )}
        </ToggleForm.FieldDisplay>
      </div>
    </>
  );
};

export default Display;
