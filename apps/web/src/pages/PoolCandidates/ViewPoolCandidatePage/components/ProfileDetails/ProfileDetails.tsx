import { useIntl } from "react-intl";

import { FragmentType, getFragment, graphql } from "@gc-digital-talent/graphql";
import { commonMessages, getLocalizedName } from "@gc-digital-talent/i18n";
import { HTMLEntity, Link, Well } from "@gc-digital-talent/ui";

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
      className="mt-6 flex flex-wrap items-center gap-3 bg-transparent bg-linear-90 from-secondary/10 to-primary/10 text-white dark:bg-transparent"
    >
      <p>
        {user.currentCity ?? intl.formatMessage(commonMessages.notFound)}
        <HTMLEntity name="&comma;" className="mr-1" />
        {getLocalizedName(user.currentProvince?.label, intl)}
      </p>
      <HTMLEntity name="&bull;" aria-hidden />
      {user.telephone ? (
        <>
          <p>
            <Link
              external
              href={`tel:${user.telephone}`}
              aria-label={user.telephone.replace(/.{1}/g, "$& ")}
              color="primary"
              size="sm"
            >
              {user.telephone}
            </Link>
          </p>
          <HTMLEntity name="&bull;" aria-hidden />
        </>
      ) : null}
      <Link external href={`mailto:${user.email}`} color="primary" size="sm">
        {user.email}
      </Link>
      <HTMLEntity name="&bull;" aria-hidden />
      <p>{getLocalizedName(user.citizenship?.label, intl)}</p>
      <HTMLEntity name="&bull;" aria-hidden />
      <p>
        {intl.formatMessage({
          defaultMessage: "General Communication",
          id: "Y6X4Ok",
          description: "Label for preferred language in profile details box.",
        })}
        {intl.formatMessage(commonMessages.dividingColon)}
        {getLocalizedName(user.preferredLang?.label, intl)}
      </p>
      <HTMLEntity name="&bull;" aria-hidden />
      <p>
        {intl.formatMessage({
          defaultMessage: "Spoken Interviews",
          id: "EUDRhe",
          description:
            "Label for preferred lang for interviews in profile details box.",
        })}
        {intl.formatMessage(commonMessages.dividingColon)}
        {getLocalizedName(user.preferredLanguageForInterview?.label, intl)}
      </p>
      <HTMLEntity name="&bull;" aria-hidden />
      <p>
        {intl.formatMessage({
          defaultMessage: "Written Exams",
          id: "sYdl0V",
          description:
            "Label for preferred lang for exams in profile details box.",
        })}
        {intl.formatMessage(commonMessages.dividingColon)}
        {getLocalizedName(user.preferredLanguageForExam?.label, intl)}
      </p>
    </Well>
  );
};

export default ProfileDetails;
