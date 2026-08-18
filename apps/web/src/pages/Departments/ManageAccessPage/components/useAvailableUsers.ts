import { useQuery } from "urql";

import { graphql } from "@gc-digital-talent/graphql";
import { unpackMaybes } from "@gc-digital-talent/helpers";

const ManageAccessDepartment_AvailableUsersQuery = graphql(/* GraphQL */ `
  query ManageAccessPoolWorkEmails($search: String) {
    workEmails(search: $search) {
      id
      workEmail
    }
  }
`);

const useAvailableUsers = (search: string) => {
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
