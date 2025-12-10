import { useWatch } from "react-hook-form";
import { MessageDescriptor, useIntl } from "react-intl";

import { commonMessages } from "@gc-digital-talent/i18n";
import { Heading, Notice } from "@gc-digital-talent/ui";
import { ScreeningStage } from "@gc-digital-talent/graphql";

import {
  applicationStatusDescriptions,
  applicationStatusLabels,
} from "~/utils/poolCandidate";

import { FormValues } from "./types";

interface CandidateFacingScreeningStageMessage {
  title: MessageDescriptor;
  content: MessageDescriptor;
}

const candidateFacingScreeningStateMessages = new Map<
  ScreeningStage,
  CandidateFacingScreeningStageMessage
>([
  [
    ScreeningStage.NewApplication,
    {
      title: applicationStatusLabels.RECEIVED,
      content: applicationStatusDescriptions.RECEIVED,
    },
  ],
  [
    ScreeningStage.ApplicationReview,
    {
      title: applicationStatusLabels.UNDER_REVIEW,
      content: applicationStatusDescriptions.UNDER_REVIEW,
    },
  ],
  [
    ScreeningStage.ScreenedIn,
    {
      title: applicationStatusLabels.APPLICATION_REVIEWED,
      content: applicationStatusDescriptions.APPLICATION_REVIEWED,
    },
  ],
  [
    ScreeningStage.UnderAssessment,
    {
      title: applicationStatusLabels.UNDER_ASSESSMENT,
      content: applicationStatusDescriptions.UNDER_ASSESSMENT,
    },
  ],
]);

const CandidateFacingScreeningStageNotice = () => {
  const intl = useIntl();
  const selectedStage = useWatch<FormValues>({ name: "screeningStage" });
  const messages = candidateFacingScreeningStateMessages.get(selectedStage);

  if (!selectedStage || !messages?.title || !messages?.content) return null;

  return (
    <>
      <Heading level="h3" size="h6" className="mt-6 mb-3">
        {intl.formatMessage({
          defaultMessage: "What the candidate sees",
          id: "oRk5nf",
          description: "Heading for candidate facing screening stage",
        }) + intl.formatMessage(commonMessages.dividingColon)}
      </Heading>
      <Notice.Root small>
        <Notice.Title as="h4">
          {intl.formatMessage(messages.title)}
        </Notice.Title>
        <Notice.Content>{intl.formatMessage(messages.content)}</Notice.Content>
      </Notice.Root>
    </>
  );
};

export default CandidateFacingScreeningStageNotice;
