import { useQuery } from "urql";

import type { ManageAccessWorkEmailFragment } from "@gc-digital-talent/graphql";
import { getFragment, graphql } from "@gc-digital-talent/graphql";
import { unpackMaybes } from "@gc-digital-talent/helpers";

const ManageAccessWorkEmail_Fragment = graphql(/* GraphQL */ `
  fragment ManageAccessWorkEmail on UserWorkEmail {
    id
    workEmail
  }
`);

const ManageAccessCommunity_WorkEmailsQuery = graphql(/* GraphQL */ `
  query ManageAccessCommunityWorkEmails($search: String) {
    workEmails(search: $search) {
      ...ManageAccessWorkEmail
    }
  }
`);

interface UseAvailableUsersReturn {
  users: ManageAccessWorkEmailFragment[];
  fetching: boolean;
}

const useAvailableUsers = (search: string): UseAvailableUsersReturn => {
  const [{ data, fetching }] = useQuery({
    query: ManageAccessCommunity_WorkEmailsQuery,
    variables: {
      search,
    },
  });

  const users = getFragment(
    ManageAccessWorkEmail_Fragment,
    unpackMaybes(data?.workEmails),
  );

  return {
    users,
    fetching,
  };
};

export default useAvailableUsers;
