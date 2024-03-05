import { useMutation } from "urql";

import { graphql } from "@gc-digital-talent/graphql";

const Application_UpdateMutation = graphql(/* GraphQL */ `
  mutation UpdateApplication($id: ID!, $application: UpdateApplicationInput!) {
    updateApplication(id: $id, application: $application) {
      id
    }
  }
`);

const useUpdateApplicationMutation = () => {
  const mutation = useMutation(Application_UpdateMutation);

  return mutation;
};

export default useUpdateApplicationMutation;
