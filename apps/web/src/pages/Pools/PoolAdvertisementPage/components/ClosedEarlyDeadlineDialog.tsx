import { useIntl } from "react-intl";
import InformationCircleIcon from "@heroicons/react/24/solid/InformationCircleIcon";

import { Button, Dialog } from "@gc-digital-talent/ui";

const ClosedEarlyDeadlineDialog = () => {
  const intl = useIntl();

  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <Button
          mode="icon_only"
          color="secondary"
          icon={InformationCircleIcon}
          aria-label={intl.formatMessage({
            defaultMessage: "Learn about how application deadlines work.",
            id: "8YKsal",
            description:
              "Info button label for pool application deadline details.",
          })}
        />
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header>
          {intl.formatMessage({
            defaultMessage: "Why is this opportunity no longer available?",
            id: "j5cMN5",
            description: "Heading for the closed early pool deadlines dialog",
          })}
        </Dialog.Header>
        <Dialog.Body>
          <div
            data-h2-display="base(flex)"
            data-h2-gap="base(x.5)"
            data-h2-flex-direction="base(column)"
            data-h2-align-items="base(flex-start)"
          >
            <p>
              {intl.formatMessage({
                defaultMessage:
                  'In some rare cases, you might be notified about a job opportunity that then indicates that is has "closed early". This happens when the job advertisement is published with incorrect information or there is a human resources requirement that needs to be changed. In order to maintain fairness, these opportunities are closed so that the updates can be performed and published as a new advertisement.',
                id: "Wn6Awr",
                description:
                  "First paragraph for the closed early pool deadlines dialog",
              })}
            </p>
            <p>
              {intl.formatMessage({
                defaultMessage:
                  "It's likely that a new version of this advertisement will be published in the future, so please check back for more information.",
                id: "4X6cKU",
                description:
                  "Second paragraph for the closed early pool deadlines dialog",
              })}
            </p>
          </div>
          <Dialog.Footer>
            <Dialog.Close>
              <Button color="secondary">
                {intl.formatMessage({
                  defaultMessage: "Close",
                  id: "4p0QdF",
                  description: "Button text used to close an open modal",
                })}
              </Button>
            </Dialog.Close>
          </Dialog.Footer>
        </Dialog.Body>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default ClosedEarlyDeadlineDialog;
