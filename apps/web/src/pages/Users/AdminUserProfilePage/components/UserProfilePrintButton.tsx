import React, { useRef, useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { useReactToPrint } from "react-to-print";
import ChevronDownIcon from "@heroicons/react/24/solid/ChevronDownIcon";

import {
  Button,
  ButtonLinkMode,
  Color,
  DropdownMenu,
} from "@gc-digital-talent/ui";

import { PoolCandidate, User } from "~/api/generated";
import printStyles from "~/styles/printStyles";
import ProfileDocument from "~/components/ProfileDocument/ProfileDocument";

type UserProfileDocumentTypes = "all-info" | "anonymous";

interface UserProfilePrintButtonProps {
  users: User[] | PoolCandidate[];
  color: Color;
  mode: ButtonLinkMode;
  beforePrint?: (handlePrint: () => void) => void;
}

const UserProfilePrintButton = ({
  users,
  color,
  mode,
  beforePrint,
}: UserProfilePrintButtonProps) => {
  const intl = useIntl();

  const [isAnonymous, setAnonymous] = useState<UserProfileDocumentTypes | "">(
    "",
  );
  const componentRef = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    pageStyle: printStyles,
    documentTitle:
      users.length === 1
        ? intl.formatMessage({
            defaultMessage: "Candidate profile",
            id: "mVmrEn",
            description: "Document title for printing User profile",
          })
        : intl.formatMessage({
            defaultMessage: "Candidate profiles",
            id: "scef3o",
            description: "Document title for printing User table results",
          }),
    onAfterPrint: () => {
      // Reset the state so we can print again
      setAnonymous("");
    },
  });

  const handlePrintChange = (value: string) => {
    if (value === "all-info" || value === "anonymous") setAnonymous(value);
  };

  useEffect(() => {
    if (isAnonymous) {
      if (beforePrint) beforePrint(handlePrint);
      else handlePrint();
    }
  }, [isAnonymous, handlePrint, beforePrint]);

  return (
    <>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          <Button color={color} mode={mode} utilityIcon={ChevronDownIcon}>
            {intl.formatMessage({
              defaultMessage: "Print profile",
              id: "Yr0nVZ",
              description: "Text label for button to print items in a table",
            })}
          </Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content align="end" collisionPadding={2}>
          <DropdownMenu.RadioGroup
            value={isAnonymous}
            onValueChange={handlePrintChange}
          >
            <DropdownMenu.RadioItem value="all-info">
              {intl.formatMessage({
                defaultMessage: "Print with all information",
                id: "qN+dwB",
                description: "Button label for print user profile.",
              })}
            </DropdownMenu.RadioItem>
            <DropdownMenu.RadioItem value="anonymous">
              {intl.formatMessage({
                defaultMessage: "Print without contact information",
                id: "c795MO",
                description: "Button label for print user anonymous profile.",
              })}
            </DropdownMenu.RadioItem>
          </DropdownMenu.RadioGroup>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
      <ProfileDocument
        anonymous={isAnonymous === "anonymous"}
        results={users}
        ref={componentRef}
      />
    </>
  );
};

export default UserProfilePrintButton;
