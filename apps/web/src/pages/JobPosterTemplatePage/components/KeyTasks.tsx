import { useIntl } from "react-intl";
import ClipboardDocumentIcon from "@heroicons/react/24/outline/ClipboardDocumentListIcon";

import { FragmentType, getFragment, graphql } from "@gc-digital-talent/graphql";
import { getLocalizedName } from "@gc-digital-talent/i18n";
import { Heading } from "@gc-digital-talent/ui";
import { htmlToRichTextJSON, RichTextRenderer } from "@gc-digital-talent/forms";

import sections from "../sections";

const JobPosterTemplateKeyTasks_Fragment = graphql(/* GraphQL */ `
  fragment JobPosterTemplateKeyTasks on JobPosterTemplate {
    tasks {
      en
      fr
    }
  }
`);

interface KeyTasksProps {
  jobPosterTemplateQuery: FragmentType<
    typeof JobPosterTemplateKeyTasks_Fragment
  >;
}

const KeyTasks = ({ jobPosterTemplateQuery }: KeyTasksProps) => {
  const intl = useIntl();
  const jobPosterTemplate = getFragment(
    JobPosterTemplateKeyTasks_Fragment,
    jobPosterTemplateQuery,
  );
  return (
    <>
      <Heading
        Icon={ClipboardDocumentIcon}
        size="h2"
        color="secondary"
        data-h2-margin-top="base(0)"
      >
        {intl.formatMessage(sections.keyTasks.longTitle)}
      </Heading>
      <div
        data-h2-display="base(flex)"
        data-h2-flex-direction="base(column)"
        data-h2-gap="base(x1)"
      >
        <div>
          {intl.formatMessage({
            defaultMessage:
              "The following key tasks are examples of the work this role might perform. When drafting your job advertisement, you’re welcome to add, remove, or modify what is listed here to suit the specifics of your team and the job you’re hoping to fill.",
            id: "KPenmQ",
            description:
              "Description displayed on the job poster template 'key tasks' section.",
          })}
        </div>
        <RichTextRenderer
          node={htmlToRichTextJSON(
            getLocalizedName(jobPosterTemplate.tasks, intl),
          )}
        />
      </div>
    </>
  );
};

export default KeyTasks;
