import { Button } from "@common/components";
import { commonMessages } from "@common/messages";
import React, { useRef } from "react";
import { useIntl } from "react-intl";
import { useReactToPrint } from "react-to-print";
import { Scalars, useGetUserProfileQuery } from "../../api/generated";
import UserProfileDocument from "./UserProfileDocument";
// import UserProfileDocument from "./UserProfileDocument";

export interface UserProfilePrintButtonProps {
  userId: Scalars["ID"];
}

export const UserProfilePrintButton: React.FunctionComponent<{
  userId: Scalars["ID"];
}> = ({ userId, children }) => {
  const intl = useIntl();

  const [{ data: initialData, fetching, error }] = useGetUserProfileQuery({
    variables: { id: userId },
  });

  const componentRef = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    pageStyle: `@page {
    size: letter portrait;
  }

  @media all {
    .page-break {
      display: none;
    }
  }

  @media print {
    .page-break {
      margin-top: 1rem;
      display: block;
      page-break-after: always;
    }
  }`,
    documentTitle: "User Aggregate",
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
      <UserProfileDocument applicant={userData.applicant} ref={componentRef} />
    </>
  ) : (
    <p>
      {intl.formatMessage({
        defaultMessage: "No candidate data",
        description: "No candidate data was found",
      })}
    </p>
  );
};

export default UserProfilePrintButton;
