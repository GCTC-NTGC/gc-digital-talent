import { useIntl } from "react-intl";

import { commonMessages } from "@gc-digital-talent/i18n";
import { Card, CardSeparator } from "@gc-digital-talent/ui";
import { FragmentType, getFragment, graphql } from "@gc-digital-talent/graphql";

import employeeProfileMessages from "~/messages/employeeProfileMessages";
import FieldDisplay from "~/components/FieldDisplay/FieldDisplay";

export const GoalsWorkStyle_Fragment = graphql(/* GraphQL */ `
  fragment GoalsWorkStyle on EmployeeProfile {
    aboutYou
    learningGoals
    workStyle
  }
`);

interface GoalsWorkStyleSectionProps {
  employeeProfileQuery: FragmentType<typeof GoalsWorkStyle_Fragment>;
}

const GoalsWorkStyleSection = ({
  employeeProfileQuery,
}: GoalsWorkStyleSectionProps) => {
  const intl = useIntl();

  const employeeProfile = getFragment(
    GoalsWorkStyle_Fragment,
    employeeProfileQuery,
  );

  return (
    <Card className="flex flex-col gap-6 wrap-anywhere">
      <FieldDisplay
        label={intl.formatMessage(employeeProfileMessages.aboutYou)}
      >
        {employeeProfile.aboutYou ??
          intl.formatMessage(commonMessages.notProvided)}
      </FieldDisplay>
      <CardSeparator space="none" />
      <FieldDisplay
        label={intl.formatMessage(employeeProfileMessages.learningGoals)}
      >
        {employeeProfile.learningGoals ??
          intl.formatMessage(commonMessages.notProvided)}
      </FieldDisplay>
      <CardSeparator space="none" />
      <FieldDisplay
        label={intl.formatMessage(employeeProfileMessages.workStyle)}
      >
        {employeeProfile.workStyle ??
          intl.formatMessage(commonMessages.notProvided)}
      </FieldDisplay>
    </Card>
  );
};

export default GoalsWorkStyleSection;
