import { useQuery } from "urql";

import { Pending, ThrowNotFound } from "@gc-digital-talent/ui";
import { ROLE_NAME } from "@gc-digital-talent/auth";
import {
  getFragment,
  graphql,
  type FragmentType,
} from "@gc-digital-talent/graphql";
import { unpackMaybes } from "@gc-digital-talent/helpers";

import RequireAuth from "~/components/RequireAuth/RequireAuth";
import useRequiredParams from "~/hooks/useRequiredParams";
import { TalentRequestSourceOptions_Fragment } from "~/components/SearchRequestFilters/fragment";

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
  optionsQuery?: FragmentType<typeof TalentRequestSourceOptions_Fragment>;
}

const Details = ({ query, optionsQuery }: DetailsProps) => {
  const talentRequest = getFragment(TalentRequestDetails_Fragment, query);
  const talentSourceOptions = unpackMaybes(
    getFragment(TalentRequestSourceOptions_Fragment, optionsQuery)
      ?.talentSource,
  );

  return (
    <div className="flex flex-col gap-y-6">
      <TalentRequestDetailsCard query={talentRequest} />
      <TalentRequestSourcesCard
        query={talentRequest}
        talentSourceOptions={talentSourceOptions}
      />
      <TalentRequestCriteriaCard query={talentRequest} />
    </div>
  );
};

const TalentRequestDetails_Query = graphql(/** GraphQL */ `
  query TalentRequestDetails($id: UUID!) {
    talentRequest(id: $id) {
      ...TalentRequestDetails
    }
    ...TalentRequestSourceOptionsFragment
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
        <Details query={data.talentRequest} optionsQuery={data} />
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
