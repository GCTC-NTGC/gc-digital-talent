import { useIntl } from "react-intl";
import { useQuery } from "urql";

import { ThrowNotFound, Pending } from "@gc-digital-talent/ui";
import { unpackMaybes } from "@gc-digital-talent/helpers";
import { useAuthorization } from "@gc-digital-talent/auth";
import { graphql } from "@gc-digital-talent/graphql";

import profileMessages from "~/messages/profileMessages";
import RequireAuth from "~/components/RequireAuth/RequireAuth";
import permissionConstants from "~/constants/permissionConstants";

import CareerTimelineAndRecruitment from "./components/CareerTimelineAndRecruitment";

export const CareerTimelineExperiences_Query = graphql(/* GraphQL */ `
  query CareerTimelineExperiences($id: UUID!) {
    user(id: $id) {
      id
      experiences {
        ...CareerTimelineExperience
      }
      poolCandidates {
        ...CareerTimelineApplication
      }
    }
    ...QualifiedRequirementCardCategories
  }
`);

const CareerTimelineAndRecruitmentPage = () => {
  const intl = useIntl();
  const { userAuthInfo } = useAuthorization();
  const [{ data, fetching, error }] = useQuery({
    query: CareerTimelineExperiences_Query,
    variables: { id: userAuthInfo?.id ?? "" },
  });

  return (
    <Pending fetching={fetching} error={error}>
      {data?.user ? (
        <CareerTimelineAndRecruitment
          userId={data?.user.id}
          experiencesQuery={unpackMaybes(data?.user.experiences)}
          applicationsQuery={unpackMaybes(data?.user.poolCandidates)}
          categoriesQuery={data}
        />
      ) : (
        <ThrowNotFound
          message={intl.formatMessage(profileMessages.userNotFound)}
        />
      )}
    </Pending>
  );
};

export const Component = () => (
  <RequireAuth roles={permissionConstants.isApplicant}>
    <CareerTimelineAndRecruitmentPage />
  </RequireAuth>
);

Component.displayName = "CareerTimelineAndRecruitmentPage";

export default CareerTimelineAndRecruitmentPage;
