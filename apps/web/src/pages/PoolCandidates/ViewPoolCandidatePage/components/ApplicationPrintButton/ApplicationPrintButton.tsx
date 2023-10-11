import React, { useRef } from "react";
import { useIntl } from "react-intl";
import { useReactToPrint } from "react-to-print";

import { Button, ButtonLinkMode, Color } from "@gc-digital-talent/ui";
import { Pool } from "@gc-digital-talent/graphql";

import { User } from "~/api/generated";
import printStyles from "~/styles/printStyles";

import ApplicationPrintDocument from "./ApplicationPrintDocument";

interface ApplicationPrintButtonProps {
  user: User;
  pool: Pool;
  color: Color;
  mode: ButtonLinkMode;
}

const ApplicationPrintButton = ({
  user,
  pool,
  color,
  mode,
}: ApplicationPrintButtonProps) => {
  const intl = useIntl();

  const componentRef = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    pageStyle: printStyles,
    documentTitle: intl.formatMessage({
      defaultMessage: "Application snapshot",
      id: "ipsXat",
      description: "Document title for printing a user's application snapshot.",
    }),
  });

  return (
    <>
      <Button color={color} mode={mode} onClick={handlePrint}>
        {intl.formatMessage({
          defaultMessage: "Print application",
          id: "0pDCvX",
          description: "Print application",
        })}
      </Button>
      <ApplicationPrintDocument user={user} pool={pool} ref={componentRef} />
    </>
  );
};

export default ApplicationPrintButton;
