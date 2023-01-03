import { Button } from "@common/components";
import React, { useRef } from "react";
import { useIntl } from "react-intl";
import { useReactToPrint } from "react-to-print";
import printStyles from "@common/constants/printStyles";
import { Applicant } from "../../api/generated";
import UserProfileDocument from "./UserProfileDocument";

export interface UserProfilePrintButtonProps {
  applicant: Applicant;
}

export const UserProfilePrintButton: React.FunctionComponent<{
  applicant: Applicant;
  children?: React.ReactNode;
}> = ({ applicant, children }) => {
  const intl = useIntl();

  const componentRef = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    pageStyle: printStyles,
    documentTitle: intl.formatMessage({
      defaultMessage: "Candidate Profile",
      id: "Thf4og",
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
      <UserProfileDocument applicants={[applicant]} ref={componentRef} />
    </>
  );
};

export default UserProfilePrintButton;
