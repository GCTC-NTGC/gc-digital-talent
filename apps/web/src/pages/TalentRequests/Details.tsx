import { useQuery } from "urql";

import { Pending, ThrowNotFound } from "@gc-digital-talent/ui";
import { ROLE_NAME } from "@gc-digital-talent/auth";
import {
  getFragment,
  graphql,
  type FragmentType,
} from "@gc-digital-talent/graphql";

import RequireAuth from "~/components/RequireAuth/RequireAuth";
import useRequiredParams from "~/hooks/useRequiredParams";

import type { RouteParams } from "./types";
import TalentRequestDetailsCard from "./components/TalentRequestDetailsCard";
import TalentRequestSourcesCard from "./components/TalentRequestSourcesCard";
import TalentRequestCriteriaCard from "./components/TalentRequestCriteriaCard";

const TalentRequestDetails_Fragment = graphql(/** GraphQL */ `
  fragment TalentRequestDetails on TalentRequest {
    ...TalentRequestDetailsCard
    ...TalentRequestSourcesCard
    ...TalentRequestCriteriaCard
  }
`);

interface DetailsProps {
  query: FragmentType<typeof TalentRequestDetails_Fragment>;
}

const Details = ({ query }: DetailsProps) => {
  const talentRequest = getFragment(TalentRequestDetails_Fragment, query);

  return (
    <div className="flex flex-col gap-y-6">
      <TalentRequestDetailsCard query={talentRequest} />
      <TalentRequestSourcesCard query={talentRequest} />
      <TalentRequestCriteriaCard query={talentRequest} />
    </div>
  );
};

const TalentRequestDetails_Query = graphql(/** GraphQL */ `
  query TalentRequestDetails($id: UUID!) {
    talentRequest(id: $id) {
      ...TalentRequestDetails
    }
  }
`);

const TalentRequestDetailsPage = () => {
  const { talentRequestId } = useRequiredParams<RouteParams>("talentRequestId");
  const [{ data, fetching, error }] = useQuery({
    query: TalentRequestDetails_Query,
    variables: { id: talentRequestId },
  });

  return (
    <Pending fetching={fetching} error={error}>
      {data?.talentRequest ? (
        <Details query={data.talentRequest} />
      ) : (
        <ThrowNotFound />
      )}
    </Pending>
  );
};

export const Component = () => (
  <RequireAuth roles={[ROLE_NAME.CommunityRecruiter, ROLE_NAME.CommunityAdmin]}>
    <TalentRequestDetailsPage />
  </RequireAuth>
);

Component.displayName = "AdminTalentRequestDetails";

export default Component;
