import * as React from "react";
import { useIntl } from "react-intl";
import uniqueId from "lodash/uniqueId";

import { FragmentType, getFragment, graphql } from "@gc-digital-talent/graphql";
import {
  commonMessages,
  getCitizenshipStatusesAdmin,
  getLanguage,
  getProvinceOrTerritory,
} from "@gc-digital-talent/i18n";
import { Link, Well } from "@gc-digital-talent/ui";

const ApplicationProfileDetails_Fragment = graphql(/* GraphQL */ `
  fragment ApplicationProfileDetails on User {
    currentCity
    currentProvince
    telephone
    email
    citizenship
    preferredLang
    preferredLanguageForInterview
    preferredLanguageForExam
  }
`);

interface ProfileDetailsProps {
  userQuery: FragmentType<typeof ApplicationProfileDetails_Fragment>;
}

const ProfileDetails = ({ userQuery }: ProfileDetailsProps) => {
  const intl = useIntl();
  const user = getFragment(ApplicationProfileDetails_Fragment, userQuery);

  const location = (
    <p>
      <span data-h2-font-size="base(caption)">
        {user.currentCity || intl.formatMessage(commonMessages.notFound)},{" "}
        {intl.formatMessage(
          user.currentProvince
            ? getProvinceOrTerritory(user.currentProvince)
            : commonMessages.notFound,
        )}
      </span>
    </p>
  );

  const telephone = user.telephone ? (
    <p>
      <Link
        external
        href={`tel:${user.telephone}`}
        aria-label={user.telephone.replace(/.{1}/g, "$& ")}
      >
        <span data-h2-font-size="base(caption)">{user.telephone}</span>
      </Link>
    </p>
  ) : null;

  const email = (
    <Link external href={`mailto:${user.email}`}>
      <span data-h2-font-size="base(caption)">{user.email}</span>
    </Link>
  );

  const citizenship = (
    <p>
      <span data-h2-font-size="base(caption)">
        {intl.formatMessage(
          user.citizenship
            ? getCitizenshipStatusesAdmin(user.citizenship)
            : commonMessages.notFound,
        )}
      </span>
    </p>
  );

  const preferredLang = (
    <p>
      <span data-h2-font-size="base(caption)">
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
      </span>
    </p>
  );

  const preferredLangForInterview = (
    <p>
      <span data-h2-font-size="base(caption)">
        {intl.formatMessage({
          defaultMessage: "Spoken Interviews",
          id: "EUDRhe",
          description:
            "Label for preferred lang for interviews in profile details box.",
        })}
        {intl.formatMessage(commonMessages.dividingColon)}
        {intl.formatMessage(
          user.preferredLanguageForInterview
            ? getLanguage(user.preferredLanguageForInterview)
            : commonMessages.notFound,
        )}
      </span>
    </p>
  );

  const preferredLangForExam = (
    <p>
      <span data-h2-font-size="base(caption)">
        {intl.formatMessage({
          defaultMessage: "Written Exams",
          id: "sYdl0V",
          description:
            "Label for preferred lang for exams in profile details box.",
        })}
        {intl.formatMessage(commonMessages.dividingColon)}
        {intl.formatMessage(
          user.preferredLanguageForExam
            ? getLanguage(user.preferredLanguageForExam)
            : commonMessages.notFound,
        )}
      </span>
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
      fontSize="caption"
      data-h2-display="base(flex)"
      data-h2-flex-wrap="base(wrap)"
      data-h2-align-items="base(center)"
      data-h2-gap="base(0, x.5)"
      data-h2-color="base(black)"
      data-h2-background="base(linear-gradient(92deg, rgba(175, 103, 255, 0.10) 1.42%, rgba(0, 195, 183, 0.10) 98.58%))"
      data-h2-margin="base(x1, 0)"
    >
      {profileDetails.map((detail, index) => (
        <div
          key={uniqueId()}
          data-h2-display="base(flex)"
          data-h2-align-items="base(center)"
          data-h2-gap="base(0, x.5)"
        >
          {index !== 0 && <span aria-hidden>&bull;</span>}
          {detail}
        </div>
      ))}
    </Well>
  );
};

export default ProfileDetails;
