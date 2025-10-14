import { useIntl } from "react-intl";
import { useNavigate } from "react-router";

import { FragmentType, getFragment, graphql } from "@gc-digital-talent/graphql";
import { empty } from "@gc-digital-talent/helpers";
import { Link } from "@gc-digital-talent/ui";
import {
  commonMessages,
  getArmedForcesStatusesProfile,
  getCitizenshipStatusesProfile,
} from "@gc-digital-talent/i18n";

import profileMessages from "~/messages/profileMessages";
import FieldDisplay from "~/components/FieldDisplay/FieldDisplay";
import useRoutes from "~/hooks/useRoutes";

import EmailVerificationStatus from "../EmailVerificationStatus";

export const PersonalInformationDisplay_Fragment = graphql(/** GraphQL */ `
  fragment PersonalInformationDisplay on User {
    firstName
    lastName
    email
    isEmailVerified
    telephone
    preferredLang {
      value
      label {
        localized
      }
    }
    preferredLanguageForInterview {
      value
      label {
        localized
      }
    }
    preferredLanguageForExam {
      value
      label {
        localized
      }
    }
    citizenship {
      value
      label {
        localized
      }
    }
    armedForcesStatus {
      value
      label {
        localized
      }
    }
  }
`);

interface DisplayProps {
  query: FragmentType<typeof PersonalInformationDisplay_Fragment>;
  showEmailVerification?: boolean;
  readOnly?: boolean;
  showEmail?: boolean;
}

const Display = ({
  query,
  showEmailVerification = false,
  readOnly = false,
  showEmail = false,
}: DisplayProps) => {
  const intl = useIntl();
  const notProvided = intl.formatMessage(commonMessages.notProvided);
  const navigate = useNavigate();
  const routes = useRoutes();
  const user = getFragment(PersonalInformationDisplay_Fragment, query);

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
  } = user;

  const handleVerifyNowClick = async () => {
    await navigate(
      routes.verifyContactEmail({
        emailAddress: email,
      }),
    );
  };

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
      {showEmail && (
        <div className="xs:col-span-2 sm:col-span-3">
          <FieldDisplay
            hasError={!email}
            label={intl.formatMessage(commonMessages.email)}
          >
            <div className="flex items-center gap-3">
              <span>{email ?? notProvided}</span>
              {showEmailVerification ? (
                <EmailVerificationStatus
                  isEmailVerified={!!isEmailVerified}
                  onClickVerify={handleVerifyNowClick}
                  readOnly={readOnly}
                />
              ) : null}
            </div>
          </FieldDisplay>
        </div>
      )}
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

export default Display;
