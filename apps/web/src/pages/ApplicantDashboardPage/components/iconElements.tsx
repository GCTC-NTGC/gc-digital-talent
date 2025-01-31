import { useIntl } from "react-intl";
import { JSX } from "react";
import BriefcaseIcon from "@heroicons/react/20/solid/BriefcaseIcon";
import PresentationChartLineIcon from "@heroicons/react/20/solid/PresentationChartLineIcon";
import XCircleIcon from "@heroicons/react/20/solid/XCircleIcon";
import ExclamationTriangleIcon from "@heroicons/react/20/solid/ExclamationTriangleIcon";

const sharedIconStyling = {
  "data-h2-height": "base(x1)",
  "data-h2-width": "base(x1)",
  "data-h2-display": "base(inline-block)",
  "data-h2-vertical-align": "base(bottom)",
  "data-h2-margin-right": "base(x.25)",
  "data-h2-padding-top": "base(x.125)",
};

interface MetaDataJobInterestProps {
  jobInterest: boolean | null | undefined;
}

export const MetaDataJobInterest = ({
  jobInterest,
}: MetaDataJobInterestProps): JSX.Element => {
  const intl = useIntl();

  const interestedWork = (
    <span>
      <BriefcaseIcon data-h2-color="base(success)" {...sharedIconStyling} />
      {intl.formatMessage({
        defaultMessage: "Interested in work",
        id: "1VKNrs",
        description: "Phrase marking interest in community work opportunities",
      })}
    </span>
  );
  const notInterestedWork = (
    <span>
      <XCircleIcon data-h2-color="base(gray.lighter)" {...sharedIconStyling} />
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
        data-h2-color="base(error)"
        {...sharedIconStyling}
      />
      <span data-h2-color="base(error.darker) base:dark(error.lightest)">
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
        data-h2-color="base(success)"
        {...sharedIconStyling}
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
      <XCircleIcon data-h2-color="base(gray.lighter)" {...sharedIconStyling} />
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
        data-h2-color="base(error)"
        {...sharedIconStyling}
      />
      <span data-h2-color="base(error.darker) base:dark(error.lightest)">
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
