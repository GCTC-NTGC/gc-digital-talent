import { useIntl } from "react-intl";

import { Heading } from "@gc-digital-talent/ui";
import { ROLE_NAME, useAuthorization } from "@gc-digital-talent/auth";

import { UserInformationProps } from "../types";
import AddToPoolDialog from "./AddToPoolDialog";
import UserCandidatesTable from "./UserCandidatesTable/UserCandidatesTable";

const CandidateStatusSection = ({
  user,
  jobPlacementOptions,
}: UserInformationProps) => {
  const intl = useIntl();
  const { roleAssignments, isLoaded } = useAuthorization();
  const isAdmin =
    isLoaded &&
    roleAssignments?.some(
      (roleAssignment) => roleAssignment.role?.name === ROLE_NAME.PlatformAdmin,
    );

  const titleString = intl.formatMessage({
    defaultMessage: "Pool status",
    id: "hIaETV",
    description: "Title of the 'Pool status' section of the view-user page",
  });

  return (
    <>
      <Heading level="h4" data-h2-margin="base(x2, 0, x1, 0)">
        {titleString}
      </Heading>
      <UserCandidatesTable
        userQuery={user}
        title={titleString}
        jobPlacementOptions={jobPlacementOptions}
      />
      {isAdmin && (
        <>
          <h4 data-h2-margin="base(x2, 0, x1, 0)">
            {intl.formatMessage({
              defaultMessage: "Add user to pool",
              id: "jtEouE",
              description:
                "Title of the 'Add user to pools' section of the view-user page",
            })}
          </h4>
          <AddToPoolDialog user={user} />
        </>
      )}
    </>
  );
};

export default CandidateStatusSection;
