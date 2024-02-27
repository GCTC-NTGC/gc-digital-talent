import React from "react";
import { useIntl } from "react-intl";
import { FormProvider, useForm } from "react-hook-form";

import { Dialog, Button } from "@gc-digital-talent/ui";
import {
  parseDateTimeUtc,
  relativeClosingDate,
} from "@gc-digital-talent/date-helpers";
import { formMessages } from "@gc-digital-talent/i18n";
import { Pool } from "@gc-digital-talent/graphql";

type PublishDialogProps = {
  closingDate: Pool["closingDate"];
  onPublish: () => void;
};

const PublishDialog = ({
  closingDate,
  onPublish,
}: PublishDialogProps): JSX.Element => {
  const intl = useIntl();
  const methods = useForm();
  const {
    formState: { isSubmitting },
  } = methods;
  const Footer = React.useMemo(
    () => (
      <>
        <div style={{ flexGrow: 2 } /* push other div to the right */}>
          <Dialog.Close>
            <Button
              color="secondary"
              data-h2-display="base(flex)"
              data-h2-align-items="base(center)"
            >
              {intl.formatMessage(formMessages.cancelGoBack)}
            </Button>
          </Dialog.Close>
        </div>
        <div>
          <Dialog.Close>
            <Button
              disabled={isSubmitting}
              onClick={() => {
                onPublish();
              }}
              mode="solid"
              color="secondary"
            >
              {intl.formatMessage({
                defaultMessage: "Publish pool",
                id: "uDuEu0",
                description:
                  "Button to publish the pool in the publish pool dialog",
              })}
            </Button>
          </Dialog.Close>
        </div>
      </>
    ),
    [intl, isSubmitting, onPublish],
  );

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
    <Dialog.Root>
      <Dialog.Trigger>
        <Button color="secondary" mode="solid">
          {intl.formatMessage({
            defaultMessage: "Publish",
            id: "t4WPUU",
            description: "Text on a button to publish the pool",
          })}
        </Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header>
          {intl.formatMessage({
            defaultMessage: "Publish",
            id: "+svnC6",
            description: "Heading for the publish pool dialog",
          })}
        </Dialog.Header>
        <Dialog.Body>
          <p>
            {intl.formatMessage({
              defaultMessage: "You're about to PUBLISH this pool.",
              id: "45BhQw",
              description: "First paragraph for publish pool dialog",
            })}
          </p>
          <p>
            {intl.formatMessage({
              defaultMessage:
                "This will make your pool available to applicants to submit applications.",
              id: "ekGCv2",
              description: "Second paragraph for publish pool dialog",
            })}
          </p>
          <p>
            {intl.formatMessage({
              defaultMessage: "This pool is set to automatically close on:",
              id: "gLHr9Y",
              description: "Third paragraph for publish pool dialog",
            })}
          </p>
          <FormProvider {...methods}>
            <p data-h2-margin="base(x.25 0)">
              {intl.formatMessage({
                defaultMessage: "Closing Date",
                id: "K+roYh",
                description: "Closing Date field label for publish pool dialog",
              })}
            </p>
            <div
              data-h2-display="base(flex)"
              data-h2-width="base(100%)"
              data-h2-gap="base(.5rem)"
              data-h2-background-color="base(gray.light)"
              data-h2-padding="base(x.5)"
              data-h2-radius="base(s)"
            >
              {closingStringLocal}
            </div>
            {closingStringPacific &&
              closingStringPacific !== closingStringLocal && (
                <>
                  <p data-h2-margin="base(x.25 0)">
                    {intl.formatMessage({
                      defaultMessage: "Closing Date (Pacific time zone)",
                      id: "hGlM9B",
                      description:
                        "Closing Date field label for publish pool dialog in the Pacific time zone",
                    })}
                  </p>
                  <div
                    data-h2-display="base(flex)"
                    data-h2-width="base(100%)"
                    data-h2-gap="base(.5rem)"
                    data-h2-background-color="base(gray.light)"
                    data-h2-padding="base(x.5)"
                    data-h2-radius="base(s)"
                  >
                    {closingStringPacific}
                  </div>
                </>
              )}
            <Dialog.Footer>{Footer}</Dialog.Footer>
          </FormProvider>
        </Dialog.Body>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default PublishDialog;
