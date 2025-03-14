import { useIntl } from "react-intl";

import { commonMessages } from "@gc-digital-talent/i18n";
import { CardBasic, CardSeparator } from "@gc-digital-talent/ui";
import { FragmentType, getFragment, graphql } from "@gc-digital-talent/graphql";

import employeeProfileMessages from "~/messages/employeeProfileMessages";

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
    <CardBasic
      data-h2-display="base(flex)"
      data-h2-flex-direction="base(column)"
      data-h2-gap="base(x1)"
      data-h2-overflow-wrap="base(anywhere)"
    >
      <div>
        <span data-h2-display="base(block)" data-h2-font-weight="base(700)">
          {intl.formatMessage(employeeProfileMessages.aboutYou)}
        </span>
        {employeeProfile.aboutYou
          ? employeeProfile.aboutYou
          : intl.formatMessage(commonMessages.notProvided)}
      </div>
      <CardSeparator data-h2-margin="base(0)" />
      <div>
        <span data-h2-display="base(block)" data-h2-font-weight="base(700)">
          {intl.formatMessage(employeeProfileMessages.learningGoals)}
        </span>
        {employeeProfile.learningGoals
          ? employeeProfile.learningGoals
          : intl.formatMessage(commonMessages.notProvided)}
      </div>
      <CardSeparator data-h2-margin="base(0)" />
      <div>
        <span data-h2-display="base(block)" data-h2-font-weight="base(700)">
          {intl.formatMessage(employeeProfileMessages.workStyle)}
        </span>
        {employeeProfile.workStyle
          ? employeeProfile.workStyle
          : intl.formatMessage(commonMessages.notProvided)}
      </div>
    </CardBasic>
  );
};

export default GoalsWorkStyleSection;
