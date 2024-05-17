import { useIntl } from "react-intl";

import { empty } from "@gc-digital-talent/helpers";
import { Link } from "@gc-digital-talent/ui";
import {
  commonMessages,
  getArmedForcesStatusesProfile,
  getCitizenshipStatusesProfile,
  getLanguage,
  getProvinceOrTerritory,
} from "@gc-digital-talent/i18n";

import FieldDisplay from "../FieldDisplay";
import DisplayColumn from "../DisplayColumn";
import { PartialUser } from "./types";

interface DisplayProps {
  user: PartialUser;
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
      <div className="mb-6 grid gap-6 sm:grid-cols-2 md:grid-cols-3">
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
            {preferredLang
              ? intl.formatMessage(getLanguage(preferredLang))
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
            {preferredLanguageForInterview
              ? intl.formatMessage(getLanguage(preferredLanguageForInterview))
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
            {currentProvince
              ? intl.formatMessage(getProvinceOrTerritory(currentProvince))
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
            {preferredLanguageForExam
              ? intl.formatMessage(getLanguage(preferredLanguageForExam))
              : notProvided}
          </FieldDisplay>
        </DisplayColumn>
      </div>
      <div className="flex flex-col gap-y-6">
        <FieldDisplay
          hasError={empty(armedForcesStatus)}
          label={intl.formatMessage({
            defaultMessage: "Veteran status",
            id: "OVWo88",
            description: "Title for Veteran status",
          })}
        >
          {armedForcesStatus !== null && armedForcesStatus !== undefined
            ? intl.formatMessage(
                getArmedForcesStatusesProfile(armedForcesStatus, false),
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
        >
          {citizenship
            ? intl.formatMessage(getCitizenshipStatusesProfile(citizenship))
            : notProvided}
        </FieldDisplay>
      </div>
    </>
  );
};

export default Display;
