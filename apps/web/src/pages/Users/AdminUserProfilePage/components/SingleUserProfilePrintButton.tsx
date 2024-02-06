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
import { User } from "@gc-digital-talent/graphql";

import printStyles from "~/styles/printStyles";
import ProfileDocument from "~/components/ProfileDocument/ProfileDocument";

const documentTitle = defineMessage({
  defaultMessage: "Candidate profile",
  id: "mVmrEn",
  description: "Document title for printing User profile",
});

interface SingleUserProfilePrintButtonProps {
  users: User[];
  color: Color;
  mode: ButtonLinkMode;
}

const SingleUserProfilePrintButton = ({
  users,
  color,
  mode,
}: SingleUserProfilePrintButtonProps) => {
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
              defaultMessage: "Print profile",
              id: "Yr0nVZ",
              description: "Text label for button to print items in a table",
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
      <ProfileDocument anonymous results={users} ref={anonymousComponentRef} />
      <ProfileDocument results={users} ref={fullComponentRef} />
    </>
  );
};

export default SingleUserProfilePrintButton;
