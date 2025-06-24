import { useIntl } from "react-intl";

import { commonMessages } from "@gc-digital-talent/i18n";
import { Well } from "@gc-digital-talent/ui";
import { RichTextRenderer, htmlToRichTextJSON } from "@gc-digital-talent/forms";
import { EditPoolAboutUsFragment } from "@gc-digital-talent/graphql";

import ToggleForm from "~/components/ToggleForm/ToggleForm";
import processMessages from "~/messages/processMessages";
import { hasAllEmptyFields } from "~/validators/process/aboutUs";

import { DisplayProps } from "../../types";

const Display = ({ pool, subtitle }: DisplayProps<EditPoolAboutUsFragment>) => {
  const intl = useIntl();
  const notProvided = intl.formatMessage(commonMessages.notProvided);
  const isNull = hasAllEmptyFields(pool);
  const { aboutUs } = pool;

  return (
    <>
      {subtitle && <p className="mb-6">{subtitle}</p>}
      {!isNull ? (
        <div className="grid gap-6 xs:grid-cols-2">
          <ToggleForm.FieldDisplay
            hasError={!aboutUs?.en}
            label={intl.formatMessage(processMessages.aboutUsEn)}
          >
            {aboutUs?.en ? (
              <RichTextRenderer node={htmlToRichTextJSON(aboutUs?.en)} />
            ) : (
              notProvided
            )}
          </ToggleForm.FieldDisplay>
          <ToggleForm.FieldDisplay
            hasError={!aboutUs?.fr}
            label={intl.formatMessage(processMessages.aboutUsFr)}
          >
            {aboutUs?.fr ? (
              <RichTextRenderer node={htmlToRichTextJSON(aboutUs?.fr)} />
            ) : (
              notProvided
            )}
          </ToggleForm.FieldDisplay>
        </div>
      ) : (
        <Well>
          {intl.formatMessage({
            defaultMessage: "This advertisement does not require about us.",
            id: "R+6vfG",
            description:
              "Message displayed when there is no about us for a process advertisement.",
          })}
        </Well>
      )}
    </>
  );
};

export default Display;
