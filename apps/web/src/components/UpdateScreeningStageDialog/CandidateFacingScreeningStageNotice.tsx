import { useWatch } from "react-hook-form";
import { useIntl } from "react-intl";

import {
  commonMessages,
  getCandidateFacingScreeningStage,
  getCandidateFacingScreeningStageDesc,
} from "@gc-digital-talent/i18n";
import { Heading, Notice } from "@gc-digital-talent/ui";

import { FormValues } from "./types";

const CandidateFacingScreeningStageNotice = () => {
  const intl = useIntl();
  const selectedStage = useWatch<FormValues>({ name: "screeningStage" });

  const title = getCandidateFacingScreeningStage(selectedStage);
  const content = getCandidateFacingScreeningStageDesc(selectedStage);

  if (!selectedStage || !title || !content) return null;

  return (
    <>
      <Heading level="h3" size="h6" className="mt-6 mb-3">
        {intl.formatMessage({
          defaultMessage: "What the candidate sees",
          id: "rismPG",
          description: "Heading for candidate facing screenign stage",
        }) + intl.formatMessage(commonMessages.dividingColon)}
      </Heading>
      <Notice.Root small>
        <Notice.Title as="h4">{intl.formatMessage(title)}</Notice.Title>
        <Notice.Content>{intl.formatMessage(content)}</Notice.Content>
      </Notice.Root>
    </>
  );
};

export default CandidateFacingScreeningStageNotice;
