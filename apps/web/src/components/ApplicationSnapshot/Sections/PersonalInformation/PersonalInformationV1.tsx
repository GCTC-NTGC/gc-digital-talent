import { useIntl } from "react-intl";

import type { LocalizedLanguage } from "@gc-digital-talent/graphql";
import { commonMessages } from "@gc-digital-talent/i18n";
import { Link } from "@gc-digital-talent/ui";

import FieldDisplay from "~/components/FieldDisplay/FieldDisplay";
import EmailVerificationStatus from "~/components/Profile/components/EmailVerificationStatus";
import profileMessages from "~/messages/profileMessages";

import type { SnapshotProps } from "../types";

export interface PersonalInformationSnapshotV1 {
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  isEmailVerified: boolean | null;
  telephone: string | null;
  preferredLang: LocalizedLanguage | null;
}

type PersonalInformationV1Props = SnapshotProps<PersonalInformationSnapshotV1>;

const PersonalInformationV1 = ({ snapshot }: PersonalInformationV1Props) => {
  const intl = useIntl();
  const notProvided = intl.formatMessage(commonMessages.notProvided);
  const {
    firstName,
    lastName,
    email,
    isEmailVerified,
    telephone,
    preferredLang,
  } = snapshot;

  return (
    <div className="grid gap-6 xs:grid-cols-2 sm:grid-cols-3">
      <FieldDisplay
        hasError={!firstName}
        label={intl.formatMessage({
          defaultMessage: "Given name",
          id: "DUh8zg",
          description: "Label for given name field",
        })}
      >
        {firstName ?? notProvided}
      </FieldDisplay>
      <FieldDisplay
        hasError={!lastName}
        label={intl.formatMessage({
          defaultMessage: "Surname",
          id: "dssZUt",
          description: "Label for surname field",
        })}
      >
        {lastName ?? notProvided}
      </FieldDisplay>
      <div className="xs:col-span-2 sm:col-span-3">
        <FieldDisplay
          hasError={!email}
          label={intl.formatMessage(commonMessages.email)}
        >
          <div className="flex items-center gap-3">
            <span>{email ?? notProvided}</span>
            <EmailVerificationStatus
              isEmailVerified={!!isEmailVerified}
              readOnly
            />
          </div>
        </FieldDisplay>
      </div>
      <FieldDisplay
        hasError={!telephone}
        label={intl.formatMessage(commonMessages.telephone)}
      >
        {telephone ? (
          <Link
            color="black"
            external
            href={`tel:${telephone}`}
            aria-label={telephone.replace(/.{1}/g, "$& ")}
          >
            {telephone}
          </Link>
        ) : (
          notProvided
        )}
      </FieldDisplay>
      <FieldDisplay
        hasError={!preferredLang}
        label={intl.formatMessage(profileMessages.communicationLanguage)}
      >
        {preferredLang?.label.localized ?? notProvided}
      </FieldDisplay>
    </div>
  );
};

export default PersonalInformationV1;
