import * as React from "react";
import { useIntl } from "react-intl";

import { User } from "@gc-digital-talent/graphql";
import {
  commonMessages,
  getCitizenshipStatusesAdmin,
  getLanguage,
  getProvinceOrTerritory,
} from "@gc-digital-talent/i18n";
import { Link, Well } from "@gc-digital-talent/ui";

interface ProfileDetailsProps {
  user: User;
}

const ProfileDetails = ({ user }: ProfileDetailsProps) => {
  const intl = useIntl();

  const location = (
    <p>
      {user.currentCity || intl.formatMessage(commonMessages.notFound)},{" "}
      {intl.formatMessage(
        user.currentProvince
          ? getProvinceOrTerritory(user.currentProvince)
          : commonMessages.notFound,
      )}
    </p>
  );

  const telephone = user.telephone ? (
    <p>
      <Link
        external
        href={`tel:${user.telephone}`}
        aria-label={user.telephone.replace(/.{1}/g, "$& ")}
      >
        {user.telephone}
      </Link>
    </p>
  ) : null;

  const email = (
    <Link external href={`mailto:${user.email}`}>
      {user.email}
    </Link>
  );

  const citizenship = (
    <p>
      {intl.formatMessage(
        user.citizenship
          ? getCitizenshipStatusesAdmin(user.citizenship)
          : commonMessages.notFound,
      )}
    </p>
  );

  const preferredLang = (
    <p>
      {intl.formatMessage({
        defaultMessage: "General Communication",
        id: "Y6X4Ok",
        description: "Label for preferred language in profile details box.",
      })}
      {intl.formatMessage(commonMessages.dividingColon)}
      {intl.formatMessage(
        user.preferredLang
          ? getLanguage(user.preferredLang)
          : commonMessages.notFound,
      )}
    </p>
  );

  const preferredLangForInterview = (
    <p>
      {intl.formatMessage({
        defaultMessage: "Spoken Interviews:",
        id: "UYtDDb",
        description:
          "Label for preferred lang for interviews in profile details box.",
      })}
      {intl.formatMessage(commonMessages.dividingColon)}
      {intl.formatMessage(
        user.preferredLanguageForInterview
          ? getLanguage(user.preferredLanguageForInterview)
          : commonMessages.notFound,
      )}
    </p>
  );

  const preferredLangForExam = (
    <p>
      {intl.formatMessage({
        defaultMessage: "Written Exams:",
        id: "M8Gy1Q",
        description:
          "Label for preferred lang for exams in profile details box.",
      })}
      {intl.formatMessage(commonMessages.dividingColon)}
      {intl.formatMessage(
        user.preferredLanguageForExam
          ? getLanguage(user.preferredLanguageForExam)
          : commonMessages.notFound,
      )}
    </p>
  );

  const profileDetails = [
    location,
    telephone,
    email,
    citizenship,
    preferredLang,
    preferredLangForInterview,
    preferredLangForExam,
  ];
  return (
    <Well
      data-h2-display="base(flex)"
      data-h2-align-items="base(center)"
      data-h2-justify-content="base(space-evenly)"
      data-h2-gap="base(0, x.5)"
      data-h2-color="base(black)"
      data-h2-margin-bottom="base(x1)"
      data-font-size="base(caption)"
    >
      {profileDetails.map((detail, index) => (
        <>
          {detail}
          {index + 1 !== profileDetails.length && (
            <span aria-hidden>&bull;</span>
          )}
        </>
      ))}
    </Well>
  );
};

export default ProfileDetails;
