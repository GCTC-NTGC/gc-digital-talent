import React from "react";
import { useIntl } from "react-intl";
import ChatBubbleLeftRightIcon from "@heroicons/react/20/solid/ChatBubbleLeftRightIcon";

import { Button, Dialog, Link } from "@gc-digital-talent/ui";

const mailLink = (chunks: React.ReactNode) => (
  <Link external href="mailto:edsc.pda-iap.esdc@hrsdc-rhdcc.gc.ca">
    {chunks}
  </Link>
);

const IapContactDialog = () => {
  const intl = useIntl();

  const title = intl.formatMessage({
    defaultMessage: "Contact us",
    id: "o4tj77",
    description:
      "Title for the contact dialog for the Indigenous Apprenticeship Program application process",
  });

  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <Button icon={ChatBubbleLeftRightIcon}>{title}</Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header>{title}</Dialog.Header>
        <Dialog.Body>
          <p>
            {intl.formatMessage(
              {
                defaultMessage:
                  "If you have questions concerning this step, or if you are unsure about how to proceed, please feel free to reach out to our support team at <mailLink>edsc.pda-iap.esdc@hrsdc-rhdcc.gc.ca</mailLink>",
                id: "TxyOcb",
                description:
                  "Text for contacting the support team within the Indigenous Apprenticeship Program application process",
              },
              { mailLink },
            )}
          </p>
        </Dialog.Body>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default IapContactDialog;
