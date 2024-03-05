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
    id: "RIi/3q",
    description: "Title for Contact us action",
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
                  "If you have questions concerning this step, or if you are unsure about how to proceed, please feel free to reach out to our support team at <a>edsc.pda-iap.esdc@hrsdc-rhdcc.gc.ca</a>.",
                id: "ltzA7w",
                description:
                  "How to get help from the support team - IAP variant",
              },
              { a: mailLink },
            )}
          </p>
        </Dialog.Body>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default IapContactDialog;
