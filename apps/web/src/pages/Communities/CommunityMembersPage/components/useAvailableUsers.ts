import { useQuery } from "urql";

import { UserWorkEmail, graphql } from "@gc-digital-talent/graphql";
import { unpackMaybes } from "@gc-digital-talent/helpers";

const ManageAccessCommunity_WorkEmailsQuery = graphql(/* GraphQL */ `
  query ManageAccessCommunityWorkEmails($search: String) {
    workEmails(search: $search) {
      id
      workEmail
    }
  }
`);

interface UseAvailableUsersReturn {
  users: UserWorkEmail[];
  fetching: boolean;
}

const useAvailableUsers = (search: string): UseAvailableUsersReturn => {
  const [{ data, fetching }] = useQuery({
    query: ManageAccessCommunity_WorkEmailsQuery,
    variables: {
      search,
    },
  });

  const users = unpackMaybes(data?.workEmails);

  return {
    users,
    fetching,
  };
};

export default useAvailableUsers;
