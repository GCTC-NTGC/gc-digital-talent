import { useQuery } from "urql";

import { UserWorkEmail, graphql } from "@gc-digital-talent/graphql";
import { unpackMaybes } from "@gc-digital-talent/helpers";

const ManageAccessDepartment_AvailableUsersQuery = graphql(/* GraphQL */ `
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
    query: ManageAccessDepartment_AvailableUsersQuery,
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
