import { useQuery } from "urql";

import { graphql } from "@gc-digital-talent/graphql";
import { unpackMaybes } from "@gc-digital-talent/helpers";

const ManageAccessPool_WorkEmailsQuery = graphql(/* GraphQL */ `
  query ManageAccessPoolWorkEmails($search: String) {
    workEmails(search: $search) {
      id
      workEmail
    }
  }
`);

const useAvailableUsers = (search: string) => {
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
