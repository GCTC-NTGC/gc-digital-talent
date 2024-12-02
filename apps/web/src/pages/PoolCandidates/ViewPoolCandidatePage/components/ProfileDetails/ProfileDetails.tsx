import { useIntl } from "react-intl";

import { FragmentType, getFragment, graphql } from "@gc-digital-talent/graphql";
import { commonMessages, getLocalizedName } from "@gc-digital-talent/i18n";
import { Link, Well } from "@gc-digital-talent/ui";

const ApplicationProfileDetails_Fragment = graphql(/* GraphQL */ `
  fragment ApplicationProfileDetails on User {
    currentCity
    currentProvince {
      label {
        en
        fr
      }
    }
    telephone
    email
    citizenship {
      label {
        en
        fr
      }
    }
    preferredLang {
      label {
        en
        fr
      }
    }
    preferredLanguageForInterview {
      label {
        en
        fr
      }
    }
    preferredLanguageForExam {
      label {
        en
        fr
      }
    }
  }
`);

interface ProfileDetailsProps {
  userQuery: FragmentType<typeof ApplicationProfileDetails_Fragment>;
}

const ProfileDetails = ({ userQuery }: ProfileDetailsProps) => {
  const intl = useIntl();
  const user = getFragment(ApplicationProfileDetails_Fragment, userQuery);

  return (
    <Well
      fontSize="caption"
      data-h2-display="base(flex)"
      data-h2-flex-wrap="base(wrap)"
      data-h2-align-items="base(center)"
      data-h2-gap="base(0, x.5)"
      data-h2-color="base(black)"
      data-h2-background="base(linear-gradient(92deg, rgba(175, 103, 255, 0.10) 1.42%, rgba(0, 195, 183, 0.10) 98.58%))"
      data-h2-margin-top="base(x1)"
    >
      <p>
        <span data-h2-font-size="base(caption)">
          {user.currentCity ?? intl.formatMessage(commonMessages.notFound)},{" "}
          {getLocalizedName(user.currentProvince?.label, intl)}
        </span>
      </p>
      <span aria-hidden>&bull;</span>
      {user.telephone ? (
        <>
          <p>
            <Link
              external
              href={`tel:${user.telephone}`}
              aria-label={user.telephone.replace(/.{1}/g, "$& ")}
            >
              <span data-h2-font-size="base(caption)">{user.telephone}</span>
            </Link>
          </p>
          <span aria-hidden>&bull;</span>
        </>
      ) : null}
      <Link external href={`mailto:${user.email}`}>
        <span data-h2-font-size="base(caption)">{user.email}</span>
      </Link>
      <span aria-hidden>&bull;</span>
      <p>
        <span data-h2-font-size="base(caption)">
          {getLocalizedName(user.citizenship?.label, intl)}
        </span>
      </p>
      <span aria-hidden>&bull;</span>
      <p>
        <span data-h2-font-size="base(caption)">
          {intl.formatMessage({
            defaultMessage: "General Communication",
            id: "Y6X4Ok",
            description: "Label for preferred language in profile details box.",
          })}
          {intl.formatMessage(commonMessages.dividingColon)}
          {getLocalizedName(user.preferredLang?.label, intl)}
        </span>
      </p>
      <span aria-hidden>&bull;</span>
      <p>
        <span data-h2-font-size="base(caption)">
          {intl.formatMessage({
            defaultMessage: "Spoken Interviews",
            id: "EUDRhe",
            description:
              "Label for preferred lang for interviews in profile details box.",
          })}
          {intl.formatMessage(commonMessages.dividingColon)}
          {getLocalizedName(user.preferredLanguageForInterview?.label, intl)}
        </span>
      </p>
      <span aria-hidden>&bull;</span>
      <p>
        <span data-h2-font-size="base(caption)">
          {intl.formatMessage({
            defaultMessage: "Written Exams",
            id: "sYdl0V",
            description:
              "Label for preferred lang for exams in profile details box.",
          })}
          {intl.formatMessage(commonMessages.dividingColon)}
          {getLocalizedName(user.preferredLanguageForExam?.label, intl)}
        </span>
      </p>
    </Well>
  );
};

export default ProfileDetails;
