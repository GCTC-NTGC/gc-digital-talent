import { useIntl } from "react-intl";

import { Heading } from "@gc-digital-talent/ui";
import { ROLE_NAME, useAuthorization } from "@gc-digital-talent/auth";
import { FragmentType, getFragment, graphql } from "@gc-digital-talent/graphql";

import { JobPlacementOptionsFragmentType } from "~/components/PoolCandidatesTable/JobPlacementDialog";

import AddToPoolDialog from "./AddToPoolDialog";
import UserCandidatesTable from "./UserCandidatesTable/UserCandidatesTable";

const CandidateStatusSection_Fragment = graphql(/** GraphQL */ `
  fragment CandidateStatusSection on User {
    ...UserCandidatesTableRow
    ...AddToPoolDialogUser
  }
`);

interface CandidateStatusSectionProps {
  userQuery?: FragmentType<typeof CandidateStatusSection_Fragment>;
  jobPlacementOptions: JobPlacementOptionsFragmentType;
}

const CandidateStatusSection = ({
  userQuery,
  jobPlacementOptions,
}: CandidateStatusSectionProps) => {
  const intl = useIntl();
  const { roleAssignments, isLoaded } = useAuthorization();
  const isAdmin =
    isLoaded &&
    roleAssignments?.some(
      (roleAssignment) => roleAssignment.role?.name === ROLE_NAME.PlatformAdmin,
    );
  const user = getFragment(CandidateStatusSection_Fragment, userQuery);

  const titleString = intl.formatMessage({
    defaultMessage: "Pool status",
    id: "hIaETV",
    description: "Title of the 'Pool status' section of the view-user page",
  });

  return (
    <>
      <Heading level="h4" className="mt-12 mb-6">
        {titleString}
      </Heading>
      <UserCandidatesTable
        userQuery={user}
        title={titleString}
        jobPlacementOptions={jobPlacementOptions}
      />
      {isAdmin && (
        <>
          <h4 className="mt-12 mb-6">
            {intl.formatMessage({
              defaultMessage: "Add user to pool",
              id: "jtEouE",
              description:
                "Title of the 'Add user to pools' section of the view-user page",
            })}
          </h4>
          <AddToPoolDialog userQuery={user} />
        </>
      )}
    </>
  );
};

export default CandidateStatusSection;
