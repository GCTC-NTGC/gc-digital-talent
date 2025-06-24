import { useIntl } from "react-intl";
import { JSX } from "react";
import BriefcaseIcon from "@heroicons/react/20/solid/BriefcaseIcon";
import PresentationChartLineIcon from "@heroicons/react/20/solid/PresentationChartLineIcon";
import XCircleIcon from "@heroicons/react/20/solid/XCircleIcon";
import ExclamationTriangleIcon from "@heroicons/react/20/solid/ExclamationTriangleIcon";
import { tv } from "tailwind-variants";

const iconStyles = tv({
  base: "mr-1.5 inline-block size-4.5 align-text-bottom",
});

interface MetaDataJobInterestProps {
  jobInterest: boolean | null | undefined;
}

export const MetaDataJobInterest = ({
  jobInterest,
}: MetaDataJobInterestProps): JSX.Element => {
  const intl = useIntl();

  const interestedWork = (
    <span>
      <BriefcaseIcon
        className={iconStyles({ class: "text-success dark:text-success-200" })}
      />
      {intl.formatMessage({
        defaultMessage: "Interested in work",
        id: "1VKNrs",
        description: "Phrase marking interest in community work opportunities",
      })}
    </span>
  );
  const notInterestedWork = (
    <span>
      <XCircleIcon
        className={iconStyles({ class: "text-gray-600 dark:text-gray-200" })}
      />
      {intl.formatMessage({
        defaultMessage: "Not interested in work",
        id: "VDVRPt",
        description:
          "Phrase marking lack of interest in community work opportunities",
      })}
    </span>
  );
  const missingWork = (
    <span>
      <ExclamationTriangleIcon
        className={iconStyles({ class: "text-error dark:text-error-200" })}
      />
      <span className="text-error dark:text-error-200">
        {intl.formatMessage({
          defaultMessage: "Missing work info",
          id: "mT1G4k",
          description:
            "Phrase marking incomplete community work opportunities interest",
        })}
      </span>
    </span>
  );

  if (jobInterest === null || jobInterest === undefined) {
    return missingWork;
  }
  return jobInterest ? interestedWork : notInterestedWork;
};

interface MetaDataTrainingInterestProps {
  trainingInterest: boolean | null | undefined;
}

export const MetaDataTrainingInterest = ({
  trainingInterest,
}: MetaDataTrainingInterestProps): JSX.Element => {
  const intl = useIntl();

  const interestedTraining = (
    <span>
      <PresentationChartLineIcon
        className={iconStyles({ class: "text-success dark:text-success-200" })}
      />
      {intl.formatMessage({
        defaultMessage: "Interested in training",
        id: "ERsZAD",
        description:
          "Phrase marking interest in community training opportunities",
      })}
    </span>
  );
  const notInterestedTraining = (
    <span>
      <XCircleIcon
        className={iconStyles({ class: "text-gray-600 dark:text-gray-200" })}
      />
      {intl.formatMessage({
        defaultMessage: "Not interested in training",
        id: "8wU0cq",
        description:
          "Phrase marking lack of interest in community training opportunities",
      })}
    </span>
  );
  const missingTraining = (
    <span>
      <ExclamationTriangleIcon
        className={iconStyles({ class: "text-error dark:text-error-200" })}
      />
      <span className="text-error dark:text-error-200">
        {intl.formatMessage({
          defaultMessage: "Missing training info",
          id: "zGma0A",
          description:
            "Phrase marking incomplete community training opportunities interest",
        })}
      </span>
    </span>
  );

  if (trainingInterest === null || trainingInterest === undefined) {
    return missingTraining;
  }
  return trainingInterest ? interestedTraining : notInterestedTraining;
};
