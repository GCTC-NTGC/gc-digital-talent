import { useIntl } from "react-intl";

import { commonMessages } from "@gc-digital-talent/i18n";
import { EmployeeProfileGoalsWorkStyleFragment } from "@gc-digital-talent/graphql";
import { CardSeparator, Well } from "@gc-digital-talent/ui";

import ToggleForm from "~/components/ToggleForm/ToggleForm";
import employeeProfileMessages from "~/messages/employeeProfileMessages";
import { hasAnyEmptyFields } from "~/validators/employeeProfile/goalsWorkStyle";

interface DisplayProps {
  employeeProfile: EmployeeProfileGoalsWorkStyleFragment;
}

const Display = ({
  employeeProfile: { aboutYou, learningGoals, workStyle },
}: DisplayProps) => {
  const intl = useIntl();
  const nullField = intl.formatMessage(
    commonMessages.missingOptionalInformation,
  );

  return (
    <div
      data-h2-display="base(flex)"
      data-h2-flex-direction="base(column)"
      data-h2-gap="base(x1)"
      data-h2-overflow-wrap="base(anywhere)"
    >
      {hasAnyEmptyFields({
        aboutYou,
        learningGoals,
        workStyle,
      }) && (
        <Well>
          {intl.formatMessage({
            defaultMessage:
              'There are currently unanswered optional questions in this section. Use the "Edit" button to review and answer any relevant fields.',
            id: "PEH7og",
            description:
              "Message for unanswered optional questions in this section",
          })}
        </Well>
      )}
      <ToggleForm.FieldDisplay
        label={intl.formatMessage(employeeProfileMessages.aboutYou)}
      >
        {aboutYou ? aboutYou : nullField}
      </ToggleForm.FieldDisplay>
      <CardSeparator data-h2-margin="base(0)" />
      <ToggleForm.FieldDisplay
        label={intl.formatMessage(employeeProfileMessages.learningGoals)}
      >
        {learningGoals ? learningGoals : nullField}
      </ToggleForm.FieldDisplay>
      <CardSeparator data-h2-margin="base(0)" />
      <ToggleForm.FieldDisplay
        label={intl.formatMessage(employeeProfileMessages.workStyle)}
      >
        {workStyle ? workStyle : nullField}
      </ToggleForm.FieldDisplay>
    </div>
  );
};

export default Display;
