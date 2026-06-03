import { useIntl } from "react-intl";
import ClipboardDocumentListIcon from "@heroicons/react/24/outline/ClipboardDocumentListIcon";
import IdentificationIcon from "@heroicons/react/24/outline/IdentificationIcon";
import { useQuery } from "urql";

import { Card, Heading, Pending, ThrowNotFound } from "@gc-digital-talent/ui";
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

const TalentRequestDetails_Fragment = graphql(/** GraphQL */ `
  fragment TalentRequestDetails on TalentRequest {
    ...TalentRequestDetailsCard
    ...TalentRequestSourcesCard
  }
`);

interface DetailsProps {
  query: FragmentType<typeof TalentRequestDetails_Fragment>;
}

const Details = ({ query }: DetailsProps) => {
  const intl = useIntl();
  const talentRequest = getFragment(TalentRequestDetails_Fragment, query);

  return (
    <div className="flex flex-col gap-y-6">
      <TalentRequestDetailsCard query={talentRequest} />
      <TalentRequestSourcesCard query={talentRequest} />

      <Card>
        <Heading
          color="secondary"
          size="h4"
          icon={ClipboardDocumentListIcon}
          className="mt-0 font-normal"
        >
          {intl.formatMessage({
            defaultMessage: "Candidate criteria",
            id: "33ENCz",
            description:
              "Heading for section outlining the criteria submitted for a talent request",
          })}
        </Heading>
        <p>
          {intl.formatMessage({
            defaultMessage:
              "The details tab provides the specific information and context about the requirements for this request.",
            id: "TgVsZ4",
            description: "Description of the talent request criteria submitted",
          })}
        </p>
        <Card.Separator className="my-6" />
      </Card>
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
