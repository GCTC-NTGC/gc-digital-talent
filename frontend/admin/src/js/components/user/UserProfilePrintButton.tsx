import { Button } from "@common/components";
import { commonMessages } from "@common/messages";
import React, { useRef } from "react";
import { useIntl } from "react-intl";
import { useReactToPrint } from "react-to-print";
import printStyles from "@common/constants/printStyles";
import { Scalars, useGetUserProfileQuery } from "../../api/generated";
import UserProfileDocument from "./UserProfileDocument";

export interface UserProfilePrintButtonProps {
  userId: Scalars["ID"];
}

export const UserProfilePrintButton: React.FunctionComponent<{
  userId: Scalars["ID"];
}> = ({ userId, children }) => {
  const intl = useIntl();

  // would be nice to only fire this if the button was clicked but you would need an imperative version of the query that you could await on
  const [{ data: initialData, fetching, error }] = useGetUserProfileQuery({
    variables: { id: userId },
  });

  const componentRef = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    pageStyle: printStyles,
    documentTitle: "Candidate Profile",
  });

  const userData = initialData;

  if (fetching) return <p>{intl.formatMessage(commonMessages.loadingTitle)}</p>;
  if (error)
    return (
      <p>
        {intl.formatMessage(commonMessages.loadingError)}
        {error.message}
      </p>
    );

  return userData?.applicant ? (
    <>
      <Button
        mode="outline"
        color="primary"
        type="button"
        onClick={handlePrint}
      >
        {children}
      </Button>
      <UserProfileDocument
        applicants={[userData.applicant]}
        ref={componentRef}
      />
    </>
  ) : (
    <p>
      {intl.formatMessage({
        defaultMessage: "No candidate data",
        id: "dAxaVL",
        description: "No candidate data was found",
      })}
    </p>
  );
};

export default UserProfilePrintButton;
