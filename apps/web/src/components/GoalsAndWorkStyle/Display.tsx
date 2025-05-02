import { useIntl } from "react-intl";

import { commonMessages } from "@gc-digital-talent/i18n";
import { FragmentType, getFragment, graphql } from "@gc-digital-talent/graphql";

import employeeProfileMessages from "~/messages/employeeProfileMessages";

import FieldDisplay from "../FieldDisplay/FieldDisplay";

const GoalsAndWorkStyleDisplay_Fragment = graphql(/* GraphQL */ `
  fragment GoalsAndWorkStyleDisplay on EmployeeProfile {
    aboutYou
    learningGoals
    workStyle
  }
`);

interface DisplayProps {
  goalsAndWorkStyleQuery: FragmentType<
    typeof GoalsAndWorkStyleDisplay_Fragment
  >;
}

const Display = ({ goalsAndWorkStyleQuery }: DisplayProps) => {
  const intl = useIntl();
  const { aboutYou, learningGoals, workStyle } = getFragment(
    GoalsAndWorkStyleDisplay_Fragment,
    goalsAndWorkStyleQuery,
  );
  const nullField = intl.formatMessage(
    commonMessages.missingOptionalInformation,
  );

  return (
    <div
      data-h2-display="base(grid)"
      data-h2-gap="base(x1)"
      data-h2-overflow-wrap="base(anywhere)"
    >
      <FieldDisplay
        label={intl.formatMessage(employeeProfileMessages.aboutYou)}
      >
        {aboutYou ?? nullField}
      </FieldDisplay>
      <FieldDisplay
        label={intl.formatMessage(employeeProfileMessages.learningGoals)}
      >
        {learningGoals ?? nullField}
      </FieldDisplay>
      <FieldDisplay
        label={intl.formatMessage(employeeProfileMessages.workStyle)}
      >
        {workStyle ?? nullField}
      </FieldDisplay>
    </div>
  );
};

export default Display;
