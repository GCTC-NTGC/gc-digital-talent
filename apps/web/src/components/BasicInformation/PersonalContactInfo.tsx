import { useIntl } from "react-intl";

import type { FragmentType } from "@gc-digital-talent/graphql";
import { getFragment, graphql } from "@gc-digital-talent/graphql";
import { commonMessages } from "@gc-digital-talent/i18n";

import FieldDisplay from "~/components/FieldDisplay/FieldDisplay";
import { getFullNameLabel } from "~/utils/nameUtils";
import profileMessages from "~/messages/profileMessages";

const PersonalContact_Fragment = graphql(/* GraphQL */ `
  fragment PersonalContact on User {
    firstName
    lastName
    email
    telephone
    workEmail
    preferredLang {
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
  }
`);

interface DisplayProps {
  personalContactQuery: FragmentType<typeof PersonalContact_Fragment>;
}

const PersonalContactInfo = ({ personalContactQuery }: DisplayProps) => {
  const intl = useIntl();
  const notProvided = intl.formatMessage(commonMessages.notProvided);
  const {
    firstName,
    lastName,
    email,
    workEmail,
    telephone,
    preferredLang,
    citizenship,
  } = getFragment(PersonalContact_Fragment, personalContactQuery);

  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <FieldDisplay
        className="col-span-2"
        label={intl.formatMessage(commonMessages.fullName)}
      >
        {getFullNameLabel(firstName, lastName, intl)}
      </FieldDisplay>
      <FieldDisplay label={intl.formatMessage(commonMessages.email)}>
        {email ?? notProvided}
      </FieldDisplay>
      <FieldDisplay label={intl.formatMessage(commonMessages.personalPhone)}>
        {telephone ?? notProvided}
      </FieldDisplay>
      <FieldDisplay
        className="col-span-2"
        label={intl.formatMessage({
          defaultMessage: "Government of Canada email",
          id: "lAuZsE",
          description: "Label for gov of canada email field",
        })}
      >
        {workEmail ?? notProvided}
      </FieldDisplay>
      <FieldDisplay
        className="col-span-2"
        label={intl.formatMessage({
          defaultMessage: "Preferred contact language",
          id: "lHmump",
          description: "Label for preferred contact language field",
        })}
      >
        {preferredLang?.label.localized ?? notProvided}
      </FieldDisplay>
      <FieldDisplay
        className="col-span-2"
        label={intl.formatMessage(profileMessages.citizenship)}
      >
        {citizenship?.label.localized ?? notProvided}
      </FieldDisplay>
    </div>
  );
};

export default PersonalContactInfo;
