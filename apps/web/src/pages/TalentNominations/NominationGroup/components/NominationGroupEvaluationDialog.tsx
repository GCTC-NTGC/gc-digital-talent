import { defineMessage, useIntl } from "react-intl";
import { useState } from "react";
import PencilSquareIcon from "@heroicons/react/20/solid/PencilSquareIcon";

import { Button, Dialog, Separator } from "@gc-digital-talent/ui";
import { commonMessages } from "@gc-digital-talent/i18n";

import talentNominationMessages from "../../../../messages/talentNominationMessages";

const dialogTitle = defineMessage({
  defaultMessage: "Submit the evaluation of this nomination",
  id: "3I3F9y",
  description: "Title for dialog to evaluate a nomination group",
});

const dialogSubtitle = defineMessage({
  defaultMessage:
    "Record the decision on whether this nomination has been approved for talent management.",
  id: "po01Az",
  description: "Subtitle for dialog to evaluate a nomination group",
});

interface NominationGroupEvaluationDialogProps {
  triggerButtonColor: string;
}

const NominationGroupEvaluationDialog = ({
  triggerButtonColor,
}: NominationGroupEvaluationDialogProps) => {
  const intl = useIntl();
  const [open, setOpen] = useState(true);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger>
        <Button
          data-h2-margin-top="base(x.1)"
          data-h2-color={triggerButtonColor}
          icon={PencilSquareIcon}
          mode={"icon_only"}
          fontSize="h4"
          aria-label={intl.formatMessage(dialogTitle)}
        />
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header subtitle={intl.formatMessage(dialogSubtitle)}>
          {intl.formatMessage(dialogTitle)}
        </Dialog.Header>
        <Dialog.Body>
          <div
            data-h2-display="base(flex)"
            data-h2-flex-direction="base(column)"
            data-h2-gap="base(x1.25)"
          >
            <div
              data-h2-display="base(flex)"
              data-h2-flex-direction="base(column)"
              data-h2-gap="base(x0.5)"
            >
              <p>
                {intl.formatMessage({
                  defaultMessage:
                    "Ready to submit the evaluation of this nomination? Please complete the form for the selected nomination options.",
                  id: "aZN5v9",
                  description:
                    "Introduction for for dialog to evaluate a nomination group",
                })}
              </p>
              <p>
                {intl.formatMessage(
                  {
                    defaultMessage: "{nomineeName} has been nominated for: ",
                    id: "SG6Kuf",
                    description:
                      "Introduction for for dialog to evaluate a nomination group",
                  },
                  {
                    nomineeName: "Ghislain",
                  },
                )}
              </p>
              <ul data-h2-margin-bottom="base:children[li:not(:last-child)](x.5)">
                <li>
                  {intl.formatMessage(
                    talentNominationMessages.nominateForAdvancement,
                  )}
                </li>
                <li>
                  {intl.formatMessage(
                    talentNominationMessages.nominateForLateralMovement,
                  )}
                </li>
                <li>
                  {intl.formatMessage(
                    talentNominationMessages.nominateForDevelopmentPrograms,
                  )}
                </li>
              </ul>
            </div>
            <Separator data-h2-margin="base(0)" />
            <div>advancement section</div>
            <Separator data-h2-margin="base(0)" />
            <div>lateral movement section</div>
            <Separator data-h2-margin="base(0)" />
            <div>development programs section</div>
          </div>
          <Dialog.Footer>
            <Button type="submit" color="secondary">
              {intl.formatMessage({
                defaultMessage: "Submit evaluation",
                id: "g82nk3",
                description: "Button to submit an evaluation form",
              })}
            </Button>
            <Dialog.Close>
              <Button type="button" color="warning" mode="inline">
                {intl.formatMessage(commonMessages.cancel)}
              </Button>
            </Dialog.Close>
          </Dialog.Footer>
        </Dialog.Body>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default NominationGroupEvaluationDialog;
