import React, { useRef } from "react";
import { useIntl } from "react-intl";
import { useReactToPrint } from "react-to-print";

import { Button } from "@gc-digital-talent/ui";

import { User } from "~/api/generated";
import printStyles from "~/styles/printStyles";
import ProfileDocument from "~/components/ProfileDocument/ProfileDocument";

interface UserProfilePrintButtonProps {
  user: User;
  children?: React.ReactNode;
}

const UserProfilePrintButton = ({
  user,
  children,
}: UserProfilePrintButtonProps) => {
  const intl = useIntl();

  const componentRef = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    pageStyle: printStyles,
    documentTitle: intl.formatMessage({
      defaultMessage: "Candidate profile",
      id: "mVmrEn",
      description: "Document title for printing User profile",
    }),
  });

  return (
    <>
      <Button color="primary" type="button" onClick={handlePrint}>
        {children}
      </Button>
      <ProfileDocument results={[user]} ref={componentRef} />
    </>
  );
};

export default UserProfilePrintButton;
