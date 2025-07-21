import { useIntl } from "react-intl";
import PuzzlePieceIcon from "@heroicons/react/24/outline/PuzzlePieceIcon";

import { Heading } from "@gc-digital-talent/ui";

import messages from "../messages";

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
      <p className="mb-7.5">
        {intl.formatMessage({
          defaultMessage:
            "To get started, select the job's classification and level. Once that's set, you'll be prompted to fill out additional details about the job in both official languages.",
          id: "IZojK4",
          description:
            "Lead-in text for job poster template career template section",
        })}
      </p>
    </div>
  );
};

export default JobDetailsFrontMatter;
