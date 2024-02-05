import React, { useRef } from "react";
import { defineMessage, useIntl } from "react-intl";
import { useReactToPrint } from "react-to-print";
import PrinterIcon from "@heroicons/react/20/solid/PrinterIcon";
import ChevronDownIcon from "@heroicons/react/20/solid/ChevronDownIcon";

import {
  Button,
  ButtonLinkMode,
  Color,
  DropdownMenu,
} from "@gc-digital-talent/ui";
import { FragmentType, User } from "@gc-digital-talent/graphql";

import printStyles from "~/styles/printStyles";

import ApplicationPrintDocument, {
  ApplicationPrintDocument_PoolFragment,
} from "./ApplicationPrintDocument";

const documentTitle = defineMessage({
  defaultMessage: "Application snapshot",
  id: "ipsXat",
  description: "Document title for printing a user's application snapshot.",
});

interface ApplicationPrintButtonProps {
  user: User;
  pool: FragmentType<typeof ApplicationPrintDocument_PoolFragment>;
  color: Color;
  mode: ButtonLinkMode;
}

const ApplicationPrintButton = ({
  user,
  pool,
  color,
  mode,
}: ApplicationPrintButtonProps) => {
  const intl = useIntl();

  const commonArgs = {
    pageStyle: printStyles,
    documentTitle: intl.formatMessage(documentTitle),
  };

  const anonymousComponentRef = useRef(null);
  const handleAnonymousPrint = useReactToPrint({
    content: () => anonymousComponentRef.current,
    ...commonArgs,
  });

  const fullComponentRef = useRef(null);
  const handleFullPrint = useReactToPrint({
    content: () => fullComponentRef.current,
    ...commonArgs,
  });

  return (
    <>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          <Button
            color={color}
            mode={mode}
            utilityIcon={ChevronDownIcon}
            icon={PrinterIcon}
          >
            {intl.formatMessage({
              defaultMessage: "Print application",
              id: "0pDCvX",
              description: "Print application",
            })}
          </Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content align="end" collisionPadding={2}>
          <DropdownMenu.Item onSelect={handleFullPrint}>
            {intl.formatMessage({
              defaultMessage: "Print with all information",
              id: "qN+dwB",
              description: "Button label for print user profile.",
            })}
          </DropdownMenu.Item>
          <DropdownMenu.Item onSelect={handleAnonymousPrint}>
            {intl.formatMessage({
              defaultMessage: "Print without contact information",
              id: "c795MO",
              description: "Button label for print user anonymous profile.",
            })}
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
      <ApplicationPrintDocument
        anonymous
        user={user}
        poolQuery={pool}
        ref={anonymousComponentRef}
      />
      <ApplicationPrintDocument
        user={user}
        poolQuery={pool}
        ref={fullComponentRef}
      />
    </>
  );
};

export default ApplicationPrintButton;
