import { useState } from "react";
import { useIntl } from "react-intl";

import { Dialog, Button, Ul } from "@gc-digital-talent/ui";
import {
  parseDateTimeUtc,
  relativeClosingDate,
} from "@gc-digital-talent/date-helpers";
import { commonMessages, formMessages } from "@gc-digital-talent/i18n";
import { Pool } from "@gc-digital-talent/graphql";

import { ProcessDialogProps } from "./types";

type PublishProcessDialogProps = ProcessDialogProps & {
  closingDate: Pool["closingDate"];
  onPublish: () => Promise<void>;
  isReadyToPublish: boolean;
};

const PublishProcessDialog = ({
  poolName,
  closingDate,
  isFetching,
  onPublish,
  isReadyToPublish,
}: PublishProcessDialogProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const intl = useIntl();

  const title = intl.formatMessage({
    defaultMessage: "Publish advertisement",
    id: "1Q/4Yb",
    description: "Title to publish an advertisement of a process",
  });

  let closingStringLocal;
  let closingStringPacific;
  if (closingDate) {
    const closingDateObject = parseDateTimeUtc(closingDate);
    closingStringLocal = relativeClosingDate({
      closingDate: closingDateObject,
      intl,
    });
    closingStringPacific = relativeClosingDate({
      closingDate: closingDateObject,
      intl,
      timeZone: "Canada/Pacific",
    });
  }

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger>
        <Button color="primary" disabled={!isReadyToPublish}>
          {title}
        </Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header>{title}</Dialog.Header>
        <Dialog.Body>
          <p data-h2-margin-bottom="base(x1)">
            {intl.formatMessage(
              {
                id: "FDZh4D",
                defaultMessage:
                  "You are about to publish the advertisement for this process: {poolName}",
                description: "Text to confirm the process to be published",
              },
              {
                poolName,
              },
            )}
          </p>
          <p data-h2-margin="base(x1, 0)">
            {intl.formatMessage({
              defaultMessage:
                "This will make your advertisement available to applicants to submit applications.",
              id: "bok2jV",
              description: "Second paragraph for publish process dialog",
            })}
          </p>
          <p data-h2-margin="base(x1, 0)">
            {intl.formatMessage({
              defaultMessage: "This process is set to automatically close on:",
              id: "o4EnIo",
              description: "Third paragraph for publish process dialog",
            })}
          </p>
          <Ul>
            <li>
              <strong>
                {intl.formatMessage({
                  defaultMessage: "Closing Date",
                  id: "K+roYh",
                  description:
                    "Closing Date field label for publish pool dialog",
                })}
                {intl.formatMessage(commonMessages.dividingColon)}
              </strong>
              {closingStringLocal}
            </li>
            {closingStringPacific &&
              closingStringPacific !== closingStringLocal && (
                <li>
                  <strong>
                    {intl.formatMessage({
                      defaultMessage: "Closing Date (Pacific time zone)",
                      id: "hGlM9B",
                      description:
                        "Closing Date field label for publish pool dialog in the Pacific time zone",
                    })}
                    {intl.formatMessage(commonMessages.dividingColon)}
                  </strong>
                  {closingStringPacific}
                </li>
              )}
          </Ul>
          <Dialog.Footer>
            <Button color="primary" onClick={onPublish} disabled={isFetching}>
              {title}
            </Button>
            <Dialog.Close>
              <Button color="warning" mode="inline">
                {intl.formatMessage(formMessages.cancelGoBack)}
              </Button>
            </Dialog.Close>
          </Dialog.Footer>
        </Dialog.Body>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default PublishProcessDialog;
