import { useIntl } from "react-intl";
import { useQuery } from "urql";

import { ThrowNotFound, Pending } from "@gc-digital-talent/ui";
import { unpackMaybes } from "@gc-digital-talent/helpers";
import { ROLE_NAME, useAuthorization } from "@gc-digital-talent/auth";
import { graphql } from "@gc-digital-talent/graphql";

import profileMessages from "~/messages/profileMessages";
import RequireAuth from "~/components/RequireAuth/RequireAuth";

import CareerTimeline from "./components/CareerTimeline";

export const CareerTimelineExperiences_Query = graphql(/* GraphQL */ `
  query CareerTimelineExperiences($id: UUID!) {
    user(id: $id) {
      id
      experiences {
        ...CareerTimelineExperience
      }
    }
  }
`);

const CareerTimelinePage = () => {
  const intl = useIntl();
  const { userAuthInfo } = useAuthorization();
  const [{ data, fetching, error }] = useQuery({
    query: CareerTimelineExperiences_Query,
    variables: { id: userAuthInfo?.id ?? "" },
  });

  return (
    <Pending fetching={fetching} error={error}>
      {data?.user ? (
        <CareerTimeline
          userId={data?.user.id}
          experiencesQuery={unpackMaybes(data?.user.experiences)}
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
  <RequireAuth roles={[ROLE_NAME.Applicant]}>
    <CareerTimelinePage />
  </RequireAuth>
);

Component.displayName = "CareerTimelinePage";

export default Component;
