import { useIntl } from "react-intl";

import { appendLanguageName, commonMessages } from "@gc-digital-talent/i18n";
import { FragmentType, getFragment } from "@gc-digital-talent/graphql";
import { htmlToRichTextJSON, RichTextRenderer } from "@gc-digital-talent/forms";
import { Heading } from "@gc-digital-talent/ui";

import jobPosterTemplateMessages from "~/messages/jobPosterTemplateMessages";

import { InitialData_Fragment } from "./KeyTasksSection";

interface DisplayProps {
  initialDataQuery: FragmentType<typeof InitialData_Fragment>;
}

const Display = ({ initialDataQuery }: DisplayProps) => {
  const intl = useIntl();
  const notProvided = intl.formatMessage(commonMessages.notProvided);

  const { tasks } = getFragment(InitialData_Fragment, initialDataQuery);

  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <div className="flex flex-col gap-6">
        <Heading level="h3" size="h6" className="m-0">
          {appendLanguageName({
            label: intl.formatMessage(jobPosterTemplateMessages.keyTasks),
            lang: "en",
            intl,
            formatted: false,
          })}
        </Heading>
        {tasks?.en ? (
          <RichTextRenderer node={htmlToRichTextJSON(tasks.en)} />
        ) : (
          notProvided
        )}
      </div>
      <div className="flex flex-col gap-6">
        <Heading level="h3" size="h6" className="m-0">
          {appendLanguageName({
            label: intl.formatMessage(jobPosterTemplateMessages.keyTasks),
            lang: "fr",
            intl,
            formatted: false,
          })}
        </Heading>
        {tasks?.fr ? (
          <RichTextRenderer node={htmlToRichTextJSON(tasks.fr)} />
        ) : (
          notProvided
        )}
      </div>
    </div>
  );
};

export default Display;
