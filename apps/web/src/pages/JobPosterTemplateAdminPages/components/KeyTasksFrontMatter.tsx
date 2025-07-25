import { useIntl } from "react-intl";
import ClipboardDocumentCheckIcon from "@heroicons/react/24/outline/ClipboardDocumentCheckIcon";

import { Heading, Ul } from "@gc-digital-talent/ui";

import messages from "~/messages/jobPosterTemplateMessages";

const KeyTasksFrontMatter = () => {
  const intl = useIntl();
  return (
    <div>
      <Heading
        level="h2"
        icon={ClipboardDocumentCheckIcon}
        color="primary"
        className="mx-0 mt-0 mb-6 font-normal"
      >
        {intl.formatMessage(messages.keyTasks)}
      </Heading>
      <div className="flex flex-col gap-3">
        <p>
          {intl.formatMessage({
            defaultMessage:
              "The key tasks serve to inspire and guide managers as they use this template to create their job advertisements. Aim to provide 4 to 8 examples and remember to end each sentence with a period.",
            id: "iZpJ6T",
            description:
              "Lead-in text for job poster template key tasks section, paragraph 1",
          })}
        </p>
        <p>
          {intl.formatMessage({
            defaultMessage:
              "When writing example tasks, consider the following questions:",
            id: "yMsBez",
            description:
              "Lead-in text for job poster template key tasks section, paragraph 2",
          })}
        </p>
        <Ul space="md">
          <li>
            {intl.formatMessage({
              defaultMessage:
                "What will the day-to-day responsibilities of this position look like?",
              id: "Lv2AK7",
              description:
                "list item for job poster template key tasks section, paragraph 2",
            })}
          </li>
          <li>
            {intl.formatMessage({
              defaultMessage: "What should the person in this role accomplish?",
              id: "YADotx",
              description:
                "list item for job poster template key tasks section, paragraph 2",
            })}
          </li>
          <li>
            {intl.formatMessage({
              defaultMessage:
                "What contributions will the successful candidate be expected to make?",
              id: "JSE20b",
              description:
                "list item for job poster template key tasks section, paragraph 2",
            })}
          </li>
        </Ul>
      </div>
    </div>
  );
};

export default KeyTasksFrontMatter;
