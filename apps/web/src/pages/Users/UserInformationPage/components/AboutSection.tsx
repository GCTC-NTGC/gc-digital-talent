import { useIntl } from "react-intl";

import { HTMLEntity, Link, Well } from "@gc-digital-talent/ui";
import { commonMessages } from "@gc-digital-talent/i18n";
import { FragmentType, getFragment, graphql } from "@gc-digital-talent/graphql";

import { getFullNameHtml } from "~/utils/nameUtils";
import { getLabels } from "~/components/Profile/components/LanguageProfile/utils";

const UserInfoAboutSection_Fragment = graphql(/** GraphQL */ `
  fragment UserInfoAboutSection on User {
    firstName
    lastName
    email
    telephone
    currentCity
    currentProvince {
      label {
        localized
      }
    }
    preferredLang {
      label {
        localized
      }
    }
    preferredLanguageForInterview {
      label {
        localized
      }
    }
    preferredLanguageForExam {
      label {
        localized
      }
    }
    armedForcesStatus {
      label {
        localized
      }
    }
    citizenship {
      label {
        localized
      }
    }
  }
`);

interface AboutSectionProps {
  userQuery?: FragmentType<typeof UserInfoAboutSection_Fragment>;
}

const AboutSection = ({ userQuery }: AboutSectionProps) => {
  const intl = useIntl();
  const labels = getLabels(intl);
  const user = getFragment(UserInfoAboutSection_Fragment, userQuery);

  return (
    <Well className="grid gap-6 wrap-anywhere xs:grid-cols-2 lg:grid-cols-3">
      <div>
        <p className="font-bold">
          {intl.formatMessage(commonMessages.name)}
          {intl.formatMessage(commonMessages.dividingColon)}
        </p>
        <p>{getFullNameHtml(user?.firstName, user?.lastName, intl)}</p>
      </div>
      <div>
        <p className="font-bold">
          {intl.formatMessage(commonMessages.email)}
          {intl.formatMessage(commonMessages.dividingColon)}
        </p>
        <p>{user?.email ?? ""}</p>
      </div>
      <div>
        <p className="font-bold">
          {intl.formatMessage(commonMessages.preferredCommunicationLanguage)}
          {intl.formatMessage(commonMessages.dividingColon)}
        </p>
        <p>{user?.preferredLang?.label?.localized ?? ""}</p>
      </div>
      <div>
        <p className="font-bold">
          {labels.prefSpokenInterviewLang}
          {intl.formatMessage(commonMessages.dividingColon)}
        </p>
        <p>{user?.preferredLanguageForInterview?.label.localized ?? ""}</p>
      </div>
      <div>
        <p className="font-bold">
          {labels.prefWrittenExamLang}
          {intl.formatMessage(commonMessages.dividingColon)}
        </p>
        <p>{user?.preferredLanguageForExam?.label.localized ?? ""}</p>
      </div>
      <div>
        <p className="font-bold">
          {intl.formatMessage({
            defaultMessage: "Phone:",
            id: "EnvwAC",
            description: "Display text for the phone number field on users",
          })}
        </p>
        <p>
          {user?.telephone ? (
            <Link
              external
              href={`tel:${user.telephone}`}
              aria-label={user.telephone.replace(/.{1}/g, "$& ")}
            >
              {user.telephone}
            </Link>
          ) : (
            ""
          )}
        </p>
      </div>
      {(!!user?.currentCity || !!user?.currentProvince) && (
        <div>
          <p className="font-bold">
            {intl.formatMessage({
              defaultMessage: "Current Location:",
              id: "DMdCkf",
              description:
                "Display text for the current location field on users",
            })}
          </p>
          <p>
            {user.currentCity ?? ""}
            {user.currentCity && user.currentProvince?.label ? (
              <HTMLEntity name="," className="mr-1" />
            ) : (
              ""
            )}
            {user?.currentProvince?.label.localized}
          </p>
        </div>
      )}
      <div>
        <p className="font-bold">
          {intl.formatMessage({
            defaultMessage: "Member of CAF:",
            id: "EkBES+",
            description: "label for CAF status",
          })}
        </p>
        {user?.armedForcesStatus?.label && (
          <p>{user.armedForcesStatus.label.localized ?? ""}</p>
        )}
      </div>
      <div>
        <p className="font-bold">
          {intl.formatMessage({
            defaultMessage: "Citizenship:",
            id: "LOhcO4",
            description: "label for citizenship status",
          })}
        </p>
        <p>{user?.citizenship?.label.localized}</p>
      </div>
    </Well>
  );
};

export default AboutSection;
