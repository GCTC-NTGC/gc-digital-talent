import { useIntl } from "react-intl";
import BoltIcon from "@heroicons/react/24/outline/BoltIcon";

import { Heading } from "@gc-digital-talent/ui";

import messages from "../messages";

const TechnicalSkillFrontMatter = () => {
  const intl = useIntl();
  return (
    <div>
      <Heading
        level="h2"
        icon={BoltIcon}
        color="error"
        className="mx-0 mt-0 mb-6 font-normal"
      >
        {intl.formatMessage(messages.technicalSkills)}
      </Heading>
      <div className="mb-7.5 flex flex-col gap-3">
        <p>
          {intl.formatMessage({
            defaultMessage:
              "Now consider what technical skills this role might need. Aim to include skills that are commonly requested for this type of role or are industry standard. In total, a template should aim to provide 8 to 12 skill examples for the manager to select from, but keep in mind that they will be free to add or remove skills as needed. As you add skills, the counter in each section will help you keep track of your total.",
            id: "rcFCSd",
            description:
              "Lead-in text for job poster template technical skills section, paragraph 1",
          })}
        </p>
        <p>
          {intl.formatMessage({
            defaultMessage:
              "You can add a special note if you need to add a generic skill that requires an instruction to guide the user of the template.",
            id: "mob3ow",
            description:
              "Lead-in text for job poster template technical skills section, paragraph 2",
          })}
        </p>
      </div>
    </div>
  );
};

export default TechnicalSkillFrontMatter;
