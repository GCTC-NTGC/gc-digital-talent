import { useIntl } from "react-intl";

import { FragmentType, getFragment, graphql } from "@gc-digital-talent/graphql";
import { commonMessages } from "@gc-digital-talent/i18n";

import FieldDisplay from "~/components/FieldDisplay/FieldDisplay";
import { getFullNameLabel } from "~/utils/nameUtils";

export const PersonalContact_Fragment = graphql(/* GraphQL */ `
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
    <div
      data-h2-display="base(grid)"
      data-h2-grid-template-columns="p-tablet(repeat(2, 1fr))"
      data-h2-gap="base(x1)"
    >
      <FieldDisplay
        data-h2-grid-column="base(span 2)"
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
        data-h2-grid-column="base(span 2)"
        label={intl.formatMessage({
          defaultMessage: "Government of Canada email",
          id: "lAuZsE",
          description: "Label for gov of canada email field",
        })}
      >
        {workEmail ?? notProvided}
      </FieldDisplay>
      <FieldDisplay
        data-h2-grid-column="base(span 2)"
        label={intl.formatMessage({
          defaultMessage: "Preferred contact language",
          id: "lHmump",
          description: "Label for preferred contact language field",
        })}
      >
        {preferredLang?.label.localized ?? notProvided}
      </FieldDisplay>
      <FieldDisplay
        data-h2-grid-column="base(span 2)"
        label={intl.formatMessage({
          defaultMessage: "Citizenship status",
          id: "ycXoSE",
          description: "Label for citizenship status field",
        })}
      >
        {citizenship?.label.localized ?? notProvided}
      </FieldDisplay>
    </div>
  );
};

export default PersonalContactInfo;
