import { useRef, useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { useReactToPrint } from "react-to-print";
import ChevronDownIcon from "@heroicons/react/20/solid/ChevronDownIcon";

import {
  Button,
  ButtonLinkMode,
  Color,
  DropdownMenu,
} from "@gc-digital-talent/ui";
import { FragmentType } from "@gc-digital-talent/graphql";

import printStyles from "~/styles/printStyles";
import ProfileDocument, {
  ProfileDocument_Fragment,
} from "~/components/ProfileDocument/ProfileDocument";
import SpinnerIcon from "~/components/SpinnerIcon/SpinnerIcon";

type UserProfileDocumentTypes = "all-info" | "anonymous";

interface UserProfilePrintButtonProps {
  users: FragmentType<typeof ProfileDocument_Fragment>[];
  color: Color;
  mode: ButtonLinkMode;
  fontSize?: "caption" | "body";
  disabled?: boolean;
  beforePrint?: () => void;
  fetching?: boolean;
}

const UserProfilePrintButton = ({
  users,
  color,
  mode,
  fetching,
  fontSize = "body",
  beforePrint,
  disabled,
}: UserProfilePrintButtonProps) => {
  const intl = useIntl();
  const onBeforeGetContentResolve =
    useRef<(value: void | PromiseLike<void>) => void>();

  const handleOnBeforeGetContent = (): Promise<void> => {
    return new Promise((resolve) => {
      beforePrint?.();
      onBeforeGetContentResolve.current = resolve;
    });
  };

  const [isAnonymous, setAnonymous] = useState<
    UserProfileDocumentTypes | undefined
  >(undefined);
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
    onBeforeGetContent: beforePrint ? handleOnBeforeGetContent : undefined,
    onAfterPrint: () => {
      // Reset the state so we can print again
      setAnonymous(undefined);
    },
  });

  const handlePrintChange = (value: string) => {
    if (value === "all-info" || value === "anonymous") setAnonymous(value);
    if (typeof value === "string") {
      handlePrint();
    }
  };

  useEffect(() => {
    if (users.length && !fetching) {
      if (onBeforeGetContentResolve.current) {
        onBeforeGetContentResolve.current();
      }
    }
  }, [fetching, users, beforePrint]);

  let margin = {};
  if (fontSize === "caption") {
    margin = { "data-h2-margin-top": "base(-2px)" };
  }

  return (
    <>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          <Button
            color={color}
            mode={mode}
            fontSize={fontSize}
            utilityIcon={ChevronDownIcon}
            disabled={disabled}
            {...(fetching && {
              icon: SpinnerIcon,
            })}
            data-h2-font-weight="base(400)"
            {...margin}
          >
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
        ref={componentRef}
        userQuery={users}
      />
    </>
  );
};

export default UserProfilePrintButton;
