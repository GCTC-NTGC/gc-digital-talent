import { useWatch } from "react-hook-form";
import { useIntl } from "react-intl";

import { Notice } from "@gc-digital-talent/ui";
import { ScreeningStage } from "@gc-digital-talent/graphql";
import { ENUM_SORT_ORDER } from "@gc-digital-talent/i18n";

import { FormValues } from "./types";

const MoveToPreviousStepNotice = ({
  screeningStage,
}: {
  screeningStage?: ScreeningStage;
}) => {
  const intl = useIntl();
  const selectedStage = useWatch<FormValues>({ name: "screeningStage" });
  const screeningStageOrder = ENUM_SORT_ORDER.SCREENING_STAGE;

  if (
    !screeningStage ||
    !selectedStage ||
    screeningStageOrder.findIndex((i) => i === screeningStage) <=
      screeningStageOrder.findIndex((i) => i === selectedStage)
  )
    return null;

  return (
    <Notice.Root small color="warning" className="mt-3">
      <Notice.Title as="h4">
        {intl.formatMessage({
          defaultMessage: "Moving to a previous step",
          id: "Y5BHHb",
          description:
            "Title for move to previous step in screening stage notice",
        })}
      </Notice.Title>
      <Notice.Content>
        {intl.formatMessage({
          defaultMessage:
            "Are you sure you want to move this candidate back in the process?",
          id: "EKsn4N",
          description:
            "Content for move to previous step in screening stage notice",
        })}
      </Notice.Content>
    </Notice.Root>
  );
};

export default MoveToPreviousStepNotice;
