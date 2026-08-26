import { useIntl } from "react-intl";

import type { AccountInformationFormFragment } from "@gc-digital-talent/graphql";
import { commonMessages } from "@gc-digital-talent/i18n";

import ToggleForm from "~/components/ToggleForm/ToggleForm";
import EmailVerificationStatus from "~/components/Profile/components/EmailVerificationStatus";

interface DisplayProps {
  query: AccountInformationFormFragment;
}

const Display = ({ query }: DisplayProps) => {
  const intl = useIntl();
  const notProvided = intl.formatMessage(commonMessages.notProvided);
  const {
    firstName,
    lastName,
    email,
    isEmailVerified,
    telephone,
    preferredLang,
    isGovEmployee,
    workEmail,
    isWorkEmailVerified,
  } = query;

  return (
    <div className="grid gap-6 xs:grid-cols-2">
      <ToggleForm.FieldDisplay
        hasError={!firstName}
        label={intl.formatMessage({
          defaultMessage: "First name",
          id: "+btI+S",
          description: "Label for first name input",
        })}
      >
        {firstName ?? notProvided}
      </ToggleForm.FieldDisplay>
      <ToggleForm.FieldDisplay
        hasError={!lastName}
        label={intl.formatMessage({
          defaultMessage: "Last name",
          id: "zDIBle",
          description: "Label for last name input",
        })}
      >
        {lastName ?? notProvided}
      </ToggleForm.FieldDisplay>
      <div className="grid gap-6 xs:w-max">
        <ToggleForm.FieldDisplay
          hasError={!telephone}
          label={intl.formatMessage(commonMessages.telephone)}
        >
          {telephone ?? notProvided}
        </ToggleForm.FieldDisplay>
        <ToggleForm.FieldDisplay
          hasError={!email}
          label={intl.formatMessage(commonMessages.email)}
        >
          <div className="flex items-center gap-3">
            <span>{email ?? notProvided}</span>
            {email ? (
              <EmailVerificationStatus
                isEmailVerified={!!isEmailVerified}
                readOnly
              />
            ) : null}
          </div>
        </ToggleForm.FieldDisplay>
        <ToggleForm.FieldDisplay
          hasError={!preferredLang}
          label={intl.formatMessage(
            commonMessages.preferredCommunicationLanguage,
          )}
        >
          {preferredLang?.label.localized ?? notProvided}
        </ToggleForm.FieldDisplay>
        <ToggleForm.FieldDisplay
          label={intl.formatMessage(commonMessages.governmentEmployee)}
        >
          {isGovEmployee
            ? intl.formatMessage(commonMessages.yes)
            : intl.formatMessage(commonMessages.no)}
        </ToggleForm.FieldDisplay>
        {isGovEmployee && (
          <ToggleForm.FieldDisplay
            hasError={!workEmail}
            label={intl.formatMessage(commonMessages.workEmail)}
          >
            <div className="flex items-center gap-3">
              <span>{workEmail ?? notProvided}</span>
              {workEmail ? (
                <EmailVerificationStatus
                  isEmailVerified={!!isWorkEmailVerified}
                  readOnly
                />
              ) : null}
            </div>
          </ToggleForm.FieldDisplay>
        )}
      </div>
    </div>
  );
};

export default Display;
