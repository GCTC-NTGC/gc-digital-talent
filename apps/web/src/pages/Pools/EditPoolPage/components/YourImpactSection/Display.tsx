import React from "react";
import { useIntl } from "react-intl";

import { commonMessages } from "@gc-digital-talent/i18n";
import { RichTextRenderer, htmlToRichTextJSON } from "@gc-digital-talent/forms";

import ToggleForm from "~/components/ToggleForm/ToggleForm";
import processMessages from "~/messages/processMessages";

import { DisplayProps } from "../../types";

const Display = ({ pool, subtitle }: DisplayProps) => {
  const intl = useIntl();
  const notProvided = intl.formatMessage(commonMessages.notProvided);
  const { yourImpact } = pool;

  return (
    <>
      {subtitle && <p className="mb-6">{subtitle}</p>}
      <div
        data-h2-display="base(grid)"
        data-h2-gap="base(x1)"
        data-h2-grid-template-columns="p-tablet(repeat(2, 1fr))"
      >
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
