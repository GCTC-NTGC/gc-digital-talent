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
    <div className="flex flex-col gap-6 wrap-anywhere">
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
        {aboutYou ?? nullField}
      </ToggleForm.FieldDisplay>
      <CardSeparator space="none" />
      <ToggleForm.FieldDisplay
        label={intl.formatMessage(employeeProfileMessages.learningGoals)}
      >
        {learningGoals ?? nullField}
      </ToggleForm.FieldDisplay>
      <CardSeparator space="none" />
      <ToggleForm.FieldDisplay
        label={intl.formatMessage(employeeProfileMessages.workStyle)}
      >
        {workStyle ?? nullField}
      </ToggleForm.FieldDisplay>
    </div>
  );
};

export default Display;
