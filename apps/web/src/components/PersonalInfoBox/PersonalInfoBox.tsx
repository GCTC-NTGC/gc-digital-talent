import type { ReactNode } from "react";
import { useIntl } from "react-intl";

import { getRuntimeVariable } from "@gc-digital-talent/env";
import {
  getFragment,
  graphql,
  type FragmentType,
} from "@gc-digital-talent/graphql";
import { Link, Notice } from "@gc-digital-talent/ui";
import { commonMessages } from "@gc-digital-talent/i18n";

import { getFullNameLabel } from "~/utils/nameUtils";

const PersonalInfoBox_Fragment = graphql(/** GraphQL */ `
  fragment PersonalInfoBox on User {
    id
    firstName
    lastName
    telephone
    email
    preferredLang {
      value
      label {
        localized
      }
    }
  }
`);

interface AccountAndContactInformationProps {
  query: FragmentType<typeof PersonalInfoBox_Fragment>;
  footer?: boolean;
}

const PersonalInfoBox = ({
  query: personalInfoQuery,
  footer,
}: AccountAndContactInformationProps) => {
  const intl = useIntl();

  const personalInfo = getFragment(PersonalInfoBox_Fragment, personalInfoQuery);

  return (
    <Notice.Root>
      <Notice.Title>
        {getFullNameLabel(personalInfo.firstName, personalInfo.lastName, intl)}
      </Notice.Title>
      <Notice.Content>
        {personalInfo.email ? (
          <p>
            <Link href={`mailto:${personalInfo.email}`} color="black">
              {personalInfo.email}
            </Link>
          </p>
        ) : null}

        {personalInfo.telephone ? <p>{personalInfo.telephone}</p> : null}
        <p>
          {intl.formatMessage({
            defaultMessage: "Preferred contact language",
            id: "AumMAr",
            description:
              "Legend text for required language preference in getting started form",
          }) +
            intl.formatMessage(commonMessages.dividingColon) +
            personalInfo.preferredLang?.label.localized}
        </p>
      </Notice.Content>
      {footer ? (
        <Notice.Footer>
          {intl.formatMessage(
            {
              defaultMessage:
                "Does this information look incorrect? You can update it by <a>visiting your profile on CanadaLogin</a>.",
              id: "hbbeY8",
              description: "Footer for create account page",
            },
            {
              a: (chunks: ReactNode) => {
                const uri = getRuntimeVariable("OAUTH_MANAGE_ACCOUNT_URI");
                return uri ? (
                  <Link href={uri} color="black" size="sm">
                    {chunks}
                  </Link>
                ) : (
                  <span>{chunks}</span>
                );
              },
            },
          )}
        </Notice.Footer>
      ) : null}
    </Notice.Root>
  );
};
export default PersonalInfoBox;
