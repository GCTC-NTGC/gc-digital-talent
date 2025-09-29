import { useIntl } from "react-intl";

import {
  LocalizedArmedForcesStatus,
  LocalizedCitizenshipStatus,
  LocalizedLanguage,
  Maybe,
} from "@gc-digital-talent/graphql";
import {
  commonMessages,
  getArmedForcesStatusesProfile,
  getCitizenshipStatusesProfile,
} from "@gc-digital-talent/i18n";
import { Link } from "@gc-digital-talent/ui";
import { empty } from "@gc-digital-talent/helpers";

import FieldDisplay from "~/components/FieldDisplay/FieldDisplay";
import EmailVerificationStatus from "~/components/Profile/components/EmailVerificationStatus";
import profileMessages from "~/messages/profileMessages";

import { ProfileSnapshotProps } from "../types";

export interface PersonalInformationSnapshotV1 {
  firstName: Maybe<string>;
  lastName: Maybe<string>;
  email: Maybe<string>;
  isEmailVerified: Maybe<boolean>;
  telephone: Maybe<string>;
  preferredLang: Maybe<LocalizedLanguage>;
  preferredLanguageForInterview: Maybe<LocalizedLanguage>;
  preferredLanguageForExam: Maybe<LocalizedLanguage>;
  citizenship: Maybe<LocalizedCitizenshipStatus>;
  armedForcesStatus: Maybe<LocalizedArmedForcesStatus>;
}

export type PersonalInformationV1Props =
  ProfileSnapshotProps<PersonalInformationSnapshotV1>;

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
    preferredLanguageForInterview,
    preferredLanguageForExam,
    citizenship,
    armedForcesStatus,
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
        label={intl.formatMessage({
          defaultMessage: "Communication language",
          id: "ceofev",
          description: "Legend text for communication language preference",
        })}
      >
        {preferredLang?.label.localized ?? notProvided}
      </FieldDisplay>
      <FieldDisplay
        hasError={!preferredLanguageForInterview}
        label={intl.formatMessage({
          defaultMessage: "Spoken interview language",
          id: "ehrsDa",
          description:
            "Legend text for spoken interview language preference for interviews",
        })}
      >
        {preferredLanguageForInterview?.label.localized ?? notProvided}
      </FieldDisplay>
      <FieldDisplay
        hasError={!preferredLanguageForExam}
        label={intl.formatMessage({
          defaultMessage: "Written exam language",
          id: "boPmF+",
          description:
            "Legend text for written exam language preference for exams",
        })}
      >
        {preferredLanguageForExam?.label.localized ?? notProvided}
      </FieldDisplay>
      <FieldDisplay
        hasError={empty(armedForcesStatus)}
        label={intl.formatMessage(profileMessages.veteranStatus)}
        className="xs:col-span-2 sm:col-span-3"
      >
        {armedForcesStatus?.value
          ? intl.formatMessage(
              getArmedForcesStatusesProfile(armedForcesStatus.value, false),
            )
          : notProvided}
      </FieldDisplay>
      <FieldDisplay
        hasError={!citizenship}
        label={intl.formatMessage({
          defaultMessage: "Citizenship status",
          id: "4v9y7U",
          description: "Citizenship status label",
        })}
        className="xs:col-span-2 sm:col-span-3"
      >
        {citizenship?.value
          ? intl.formatMessage(getCitizenshipStatusesProfile(citizenship.value))
          : notProvided}
      </FieldDisplay>
    </div>
  );
};

export default PersonalInformationV1;
