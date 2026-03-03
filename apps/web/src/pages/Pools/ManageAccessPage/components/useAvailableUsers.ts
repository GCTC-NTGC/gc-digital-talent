import { useQuery } from "urql";

import { UserWorkEmail, graphql } from "@gc-digital-talent/graphql";
import { unpackMaybes } from "@gc-digital-talent/helpers";

const ManageAccessPool_WorkEmailsQuery = graphql(/* GraphQL */ `
  query ManageAccessPoolWorkEmails($search: String) {
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
    query: ManageAccessPool_WorkEmailsQuery,
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
