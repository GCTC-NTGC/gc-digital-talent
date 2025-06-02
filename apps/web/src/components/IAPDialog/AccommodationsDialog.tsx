import { useIntl } from "react-intl";
import { ReactNode } from "react";

import { Button, Dialog, Link } from "@gc-digital-talent/ui";

import CloseButton from "./CloseButton";
import { BasicDialogProps } from "./types";

const mailAccessor = (chunks: ReactNode) => (
  <Link
    external
    color="secondary"
    href="mailto:edsc.pda-iap.esdc@hrsdc-rhdcc.gc.ca"
  >
    {chunks}
  </Link>
);

const AccommodationsDialog = ({ btnProps }: BasicDialogProps) => {
  const intl = useIntl();
  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <Button color="primary" mode="solid" {...btnProps}>
          {intl.formatMessage({
            defaultMessage: "Accessibility and accommodations",
            id: "CKsQyK",
            description:
              "Title of the accessibility and accommodations information dialog",
          })}
        </Button>
      </Dialog.Trigger>
      <Dialog.Content
        closeLabel={intl.formatMessage({
          defaultMessage: "Close",
          id: "4p0QdF",
          description: "Button text used to close an open modal",
        })}
      >
        <Dialog.Header>
          {intl.formatMessage({
            defaultMessage: "Accessibility and accommodations",
            id: "CKsQyK",
            description:
              "Title of the accessibility and accommodations information dialog",
          })}
        </Dialog.Header>
        <Dialog.Body>
          <p>
            {intl.formatMessage(
              {
                defaultMessage:
                  "Do you require accommodations or do you have any questions about this process? Please contact the Office of Indigenous Initiatives if you require any accommodations during this application at <mailLink>edsc.pda-iap.esdc@hrsdc-rhdcc.gc.ca</mailLink>.",
                id: "jO8i+2",
                description:
                  "First paragraph of the accessibility and accommodations information dialog",
              },
              {
                mailLink: mailAccessor,
              },
            )}
          </p>
          <Dialog.Footer>
            <Dialog.Close>
              <CloseButton />
            </Dialog.Close>
          </Dialog.Footer>
        </Dialog.Body>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default AccommodationsDialog;
