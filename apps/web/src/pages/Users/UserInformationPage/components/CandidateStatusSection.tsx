import React from "react";
import { useIntl } from "react-intl";

import { Heading } from "@gc-digital-talent/ui";
import { ROLE_NAME, useAuthorization } from "@gc-digital-talent/auth";

import PoolStatusTable from "~/components/PoolStatusTable/PoolStatusTable";

import { UserInformationProps } from "../types";
import AddToPoolDialog from "./AddToPoolDialog";

const CandidateStatusSection = ({ user, pools }: UserInformationProps) => {
  const intl = useIntl();
  const { roleAssignments, isLoaded } = useAuthorization();
  const isAdmin =
    isLoaded &&
    roleAssignments?.some(
      (roleAssignment) => roleAssignment.role?.name === ROLE_NAME.PlatformAdmin,
    );

  return (
    <>
      <Heading level="h4" data-h2-margin="base(x2, 0, x1, 0)">
        {intl.formatMessage({
          defaultMessage: "Pool status",
          id: "hIaETV",
          description:
            "Title of the 'Pool status' section of the view-user page",
        })}
      </Heading>
      <PoolStatusTable user={user} pools={pools} />
      {isAdmin && (
        <>
          <h5 data-h2-margin="base(x2, 0, x1, 0)">
            {intl.formatMessage({
              defaultMessage: "Add user to pool",
              id: "jtEouE",
              description:
                "Title of the 'Add user to pools' section of the view-user page",
            })}
          </h5>
          <AddToPoolDialog user={user} pools={pools} />
        </>
      )}
    </>
  );
};

export default CandidateStatusSection;
