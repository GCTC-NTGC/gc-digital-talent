import { useIntl } from "react-intl";

import { commonMessages } from "@gc-digital-talent/i18n";
import { RichTextRenderer, htmlToRichTextJSON } from "@gc-digital-talent/forms";
import { EmployeeProfileGoalsWorkStyleFragment } from "@gc-digital-talent/graphql";
import { Well } from "@gc-digital-talent/ui";

import ToggleForm from "~/components/ToggleForm/ToggleForm";
import employeeProfileMessages from "~/messages/employeeProfileMessages";
import { hasOneEmptyField } from "~/validators/employeeProfile/goalsWorkStyle";

interface DisplayProps {
  employeeProfile: EmployeeProfileGoalsWorkStyleFragment;
}

const Display = ({
  employeeProfile: { aboutYou, careerGoals, learningGoals, workStyle },
}: DisplayProps) => {
  const intl = useIntl();
  const notProvided = intl.formatMessage(commonMessages.notProvided);

  return (
    <div
      data-h2-display="base(flex)"
      data-h2-flex-direction="base(column)"
      data-h2-gap="base(x1)"
    >
      {hasOneEmptyField({
        aboutYou,
        careerGoals,
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
        hasError={!aboutYou}
        label={intl.formatMessage(employeeProfileMessages.aboutYou)}
      >
        {aboutYou ? (
          <RichTextRenderer node={htmlToRichTextJSON(aboutYou)} />
        ) : (
          notProvided
        )}
      </ToggleForm.FieldDisplay>
      <ToggleForm.FieldDisplay
        hasError={!careerGoals}
        label={intl.formatMessage(employeeProfileMessages.careerGoals)}
      >
        {careerGoals ? (
          <RichTextRenderer node={htmlToRichTextJSON(careerGoals)} />
        ) : (
          notProvided
        )}
      </ToggleForm.FieldDisplay>
      <ToggleForm.FieldDisplay
        hasError={!learningGoals}
        label={intl.formatMessage(employeeProfileMessages.learningGoals)}
      >
        {learningGoals ? (
          <RichTextRenderer node={htmlToRichTextJSON(learningGoals)} />
        ) : (
          notProvided
        )}
      </ToggleForm.FieldDisplay>
      <ToggleForm.FieldDisplay
        hasError={!workStyle}
        label={intl.formatMessage(employeeProfileMessages.workStyle)}
      >
        {workStyle ? (
          <RichTextRenderer node={htmlToRichTextJSON(workStyle)} />
        ) : (
          notProvided
        )}
      </ToggleForm.FieldDisplay>
    </div>
  );
};

export default Display;
