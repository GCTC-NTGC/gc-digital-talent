import React, { useRef } from "react";
import { useIntl } from "react-intl";
import { useReactToPrint } from "react-to-print";

import { Button } from "@gc-digital-talent/ui";

import { Applicant } from "~/api/generated";
import printStyles from "~/styles/printStyles";
import ProfileDocument from "~/components/ProfileDocument/ProfileDocument";

export interface UserProfilePrintButtonProps {
  applicant: Applicant;
}

const UserProfilePrintButton = ({
  applicant,
  children,
}: {
  applicant: Applicant;
  children?: React.ReactNode;
}) => {
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
      <Button
        mode="outline"
        color="primary"
        type="button"
        onClick={handlePrint}
      >
        {children}
      </Button>
      <ProfileDocument results={[applicant]} ref={componentRef} />
    </>
  );
};

export default UserProfilePrintButton;
