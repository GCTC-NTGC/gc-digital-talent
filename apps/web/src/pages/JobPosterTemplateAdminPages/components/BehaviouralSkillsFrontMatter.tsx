import { useIntl } from "react-intl";
import BoltIcon from "@heroicons/react/24/outline/BoltIcon";

import { Heading } from "@gc-digital-talent/ui";

import messages from "../messages";

const BehaviouralSkillsFrontMatter = () => {
  const intl = useIntl();
  return (
    <div>
      <Heading
        level="h2"
        icon={BoltIcon}
        color="warning"
        className="mx-0 mt-0 mb-6 font-normal"
      >
        {intl.formatMessage(messages.behaviouralSkills)}
      </Heading>
      <div className="flex flex-col gap-3">
        <p>
          {intl.formatMessage({
            defaultMessage:
              "With technical skills chosen, let’s look at behavioural skills. Select examples of behavioural skills based on what a potential candidate would need to succeed in the role. Don’t forget, in total, a template should aim to provide 8 to 12 skills for a manager to choose from. As you add skills, the counter will help you keep track of your total.",
            id: "z7UQ5V",
            description:
              "Lead-in text for job poster template behavioural skills section, paragraph 1",
          })}
        </p>
        <p>
          {intl.formatMessage({
            defaultMessage:
              "You can add a special note if you want to add a generic skill with additional instructions to guide the user of the template.",
            id: "B6VbYI",
            description:
              "Lead-in text for job poster template behavioural skills section, paragraph 2",
          })}
        </p>
      </div>
    </div>
  );
};

export default BehaviouralSkillsFrontMatter;
