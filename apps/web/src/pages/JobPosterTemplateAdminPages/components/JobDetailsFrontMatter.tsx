import { useIntl } from "react-intl";
import PuzzlePieceIcon from "@heroicons/react/24/outline/PuzzlePieceIcon";

import { Heading } from "@gc-digital-talent/ui";

import messages from "~/messages/jobPosterTemplateMessages";

const JobDetailsFrontMatter = () => {
  const intl = useIntl();
  return (
    <div>
      <Heading
        level="h2"
        icon={PuzzlePieceIcon}
        color="secondary"
        className="mx-0 mt-0 mb-6 font-normal"
      >
        {intl.formatMessage(messages.jobDetails)}
      </Heading>
      <p>
        {intl.formatMessage({
          defaultMessage: "Provide the basic details for this job.",
          id: "Ivx6xY",
          description:
            "Lead-in text for job poster template career template section",
        })}
      </p>
    </div>
  );
};

export default JobDetailsFrontMatter;
