import { Button } from "@common/components";
import { commonMessages } from "@common/messages";
import React, { useRef } from "react";
import { useIntl } from "react-intl";
import { useReactToPrint } from "react-to-print";
import printStyles from "@common/constants/printStyles";
import NotFound from "@common/components/NotFound";
import Pending from "@common/components/Pending";
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

  return (
    <Pending fetching={fetching} error={error}>
      {userData?.applicant ? (
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
            applicant={userData.applicant}
            ref={componentRef}
          />
        </>
      ) : (
        <NotFound headingMessage="Not found">
          {intl.formatMessage({
            defaultMessage: "No candidate data.",
            description: "Message to display when no candidate data was found.",
          })}
        </NotFound>
      )}
    </Pending>
  );
};

export default UserProfilePrintButton;
