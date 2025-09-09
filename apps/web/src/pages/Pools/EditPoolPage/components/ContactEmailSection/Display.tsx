import { useIntl } from "react-intl";

import { commonMessages } from "@gc-digital-talent/i18n";
import { EditPoolContactEmailFragment } from "@gc-digital-talent/graphql";

import ToggleForm from "~/components/ToggleForm/ToggleForm";
import processMessages from "~/messages/processMessages";

import { DisplayProps } from "../../types";

const Display = ({
  pool,
  subtitle,
}: DisplayProps<EditPoolContactEmailFragment>) => {
  const intl = useIntl();
  const notProvided = intl.formatMessage(commonMessages.notProvided);
  const { contactEmail } = pool;

  return (
    <>
      {subtitle && <p className="mb-6">{subtitle}</p>}
      <div>
        <ToggleForm.FieldDisplay
          hasError={!contactEmail}
          label={intl.formatMessage(processMessages.contactEmail)}
        >
          {contactEmail ?? notProvided}
        </ToggleForm.FieldDisplay>
      </div>
    </>
  );
};

export default Display;
