import { useRef } from "react";
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
import ProfileDocument from "../../../../../components/ProfileDocument/ProfileDocument";

const printApplication = defineMessage({
  defaultMessage: "Print application",
  id: "0pDCvX",
  description: "Print application",
});

interface ApplicationPrintButtonProps {
  user: User;
  pool: FragmentType<typeof ApplicationPrintDocument_PoolFragment>;
  color: Color;
  mode: ButtonLinkMode;
  buttonLabel?: string;
}

const ApplicationPrintButton = ({
  user,
  pool,
  color,
  mode,
  buttonLabel,
}: ApplicationPrintButtonProps) => {
  const intl = useIntl();

  const commonArgs = {
    pageStyle: printStyles,
  };

  const applicationRef = useRef(null);
  const handleApplicationPrint = useReactToPrint({
    content: () => applicationRef.current,
    documentTitle: intl.formatMessage({
      defaultMessage: "Application",
      id: "bN9qA1",
      description: "Document title for application",
    }),
    ...commonArgs,
  });

  const fullProfileRef = useRef(null);
  const handleFullPrint = useReactToPrint({
    content: () => fullProfileRef.current,
    documentTitle: intl.formatMessage({
      defaultMessage: "Full profile",
      id: "fuMeUp",
      description: "Document title for full profile",
    }),
    ...commonArgs,
  });

  const anonymousProfileRef = useRef(null);
  const handleAnonymousPrint = useReactToPrint({
    content: () => anonymousProfileRef.current,
    documentTitle: intl.formatMessage({
      defaultMessage: "Profile without contact information",
      id: "53zIgk",
      description: "Document title for anonymous profile",
    }),
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
            {buttonLabel ?? intl.formatMessage(printApplication)}
          </Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content align="end" collisionPadding={2}>
          <DropdownMenu.Item onSelect={handleApplicationPrint}>
            {intl.formatMessage(printApplication)}
          </DropdownMenu.Item>
          <DropdownMenu.Item onSelect={handleFullPrint}>
            {intl.formatMessage({
              defaultMessage: "Print full profile",
              id: "UzbDEi",
              description: "Button label for print full user profile",
            })}
          </DropdownMenu.Item>
          <DropdownMenu.Item onSelect={handleAnonymousPrint}>
            {intl.formatMessage({
              defaultMessage: "Print profile without contact information",
              id: "Y2PPGY",
              description: "Button label for print user anonymous profile",
            })}
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
      <ApplicationPrintDocument
        user={user}
        poolQuery={pool}
        ref={applicationRef}
      />
      <ProfileDocument results={[user]} ref={fullProfileRef} />
      <ProfileDocument anonymous results={[user]} ref={anonymousProfileRef} />
    </>
  );
};

export default ApplicationPrintButton;
