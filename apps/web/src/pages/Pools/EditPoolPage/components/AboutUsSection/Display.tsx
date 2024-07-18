import { useIntl } from "react-intl";

import { commonMessages } from "@gc-digital-talent/i18n";
import { Well } from "@gc-digital-talent/ui";
import { RichTextRenderer, htmlToRichTextJSON } from "@gc-digital-talent/forms";
import { EditPoolAboutUsFragment } from "@gc-digital-talent/graphql";

import ToggleForm from "~/components/ToggleForm/ToggleForm";
import processMessages from "~/messages/processMessages";
import { hasAllEmptyFields } from "~/validators/process/aboutUs";

import { DisplayProps } from "../../types";

const Display = ({
  pool,
  subtitle,
}: { pool: EditPoolAboutUsFragment } & Pick<DisplayProps, "subtitle">) => {
  const intl = useIntl();
  const notProvided = intl.formatMessage(commonMessages.notProvided);
  const isNull = hasAllEmptyFields(pool);
  const { aboutUs } = pool;

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
