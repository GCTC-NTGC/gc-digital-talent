import { useIntl } from "react-intl";

import { empty } from "@gc-digital-talent/helpers";
import { Link } from "@gc-digital-talent/ui";
import {
  commonMessages,
  getArmedForcesStatusesProfile,
  getCitizenshipStatusesProfile,
  getLocalizedName,
} from "@gc-digital-talent/i18n";
import { User } from "@gc-digital-talent/graphql";

import profileMessages from "~/messages/profileMessages";

import FieldDisplay from "../FieldDisplay";
import DisplayColumn from "../DisplayColumn";

interface DisplayProps {
  user: User;
}

const Display = ({
  user: {
    firstName,
    lastName,
    email,
    telephone,
    preferredLang,
    preferredLanguageForInterview,
    preferredLanguageForExam,
    currentCity,
    currentProvince,
    citizenship,
    armedForcesStatus,
  },
}: DisplayProps) => {
  const intl = useIntl();
  const notProvided = intl.formatMessage(commonMessages.notProvided);

  return (
    <>
      <div
        data-h2-display="base(grid)"
        data-h2-grid-template-columns="p-tablet(repeat(2, 1fr)) l-tablet(repeat(3, 1fr))"
        data-h2-gap="base(x1)"
      >
        <DisplayColumn>
          <FieldDisplay
            hasError={!firstName}
            label={intl.formatMessage({
              defaultMessage: "Given name",
              id: "DUh8zg",
              description: "Label for given name field",
            })}
          >
            {firstName || notProvided}
          </FieldDisplay>
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
            {preferredLang?.label
              ? getLocalizedName(preferredLang.label, intl)
              : notProvided}
          </FieldDisplay>
        </DisplayColumn>
        <DisplayColumn>
          <FieldDisplay
            hasError={!lastName}
            label={intl.formatMessage({
              defaultMessage: "Surname",
              id: "dssZUt",
              description: "Label for surname field",
            })}
          >
            {lastName || notProvided}
          </FieldDisplay>
          <FieldDisplay
            hasError={!currentCity}
            label={intl.formatMessage({
              defaultMessage: "Current city",
              id: "de/Vcy",
              description: "Label for current city field in About Me form",
            })}
          >
            {currentCity || notProvided}
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
            {preferredLanguageForInterview?.label
              ? getLocalizedName(preferredLanguageForInterview.label, intl)
              : notProvided}
          </FieldDisplay>
        </DisplayColumn>
        <DisplayColumn>
          <FieldDisplay
            hasError={!email}
            label={intl.formatMessage(commonMessages.email)}
          >
            {email || notProvided}
          </FieldDisplay>
          <FieldDisplay
            hasError={!currentProvince}
            label={intl.formatMessage({
              defaultMessage: "Province or territory",
              id: "yzgwjd",
              description: "Label for current province or territory field",
            })}
          >
            {currentProvince?.label
              ? getLocalizedName(currentProvince.label, intl)
              : notProvided}
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
            {preferredLanguageForExam?.label
              ? getLocalizedName(preferredLanguageForExam.label, intl)
              : notProvided}
          </FieldDisplay>
        </DisplayColumn>
      </div>
      <FieldDisplay
        hasError={empty(armedForcesStatus)}
        label={intl.formatMessage(profileMessages.veteranStatus)}
        data-h2-padding-top="base(x1)"
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
        data-h2-padding-top="base(x1)"
      >
        {citizenship?.value
          ? intl.formatMessage(getCitizenshipStatusesProfile(citizenship.value))
          : notProvided}
      </FieldDisplay>
    </>
  );
};

export default Display;
