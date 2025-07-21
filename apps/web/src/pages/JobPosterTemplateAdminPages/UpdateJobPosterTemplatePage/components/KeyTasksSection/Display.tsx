import { useIntl } from "react-intl";

import { commonMessages } from "@gc-digital-talent/i18n";
import { FragmentType, getFragment } from "@gc-digital-talent/graphql";
import { htmlToRichTextJSON, RichTextRenderer } from "@gc-digital-talent/forms";

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
        <h3 className="font-bold">
          {intl.formatMessage({
            defaultMessage: "English key tasks",
            id: "FxP6EJ",
            description: "Title for the English key tasks section",
          })}
        </h3>
        {tasks?.en ? (
          <RichTextRenderer node={htmlToRichTextJSON(tasks.en)} />
        ) : (
          notProvided
        )}
      </div>
      <div className="flex flex-col gap-6">
        <h3 className="font-bold">
          {intl.formatMessage({
            defaultMessage: "French key tasks",
            id: "54+ZUk",
            description: "Title for the French key tasks section",
          })}
        </h3>
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
