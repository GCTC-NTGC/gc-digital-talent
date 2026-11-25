import MagnifyingGlassPlusIcon from "@heroicons/react/24/outline/MagnifyingGlassPlusIcon";
import { useIntl } from "react-intl";
import { useQuery } from "urql";

import { ROLE_NAME } from "@gc-digital-talent/auth";
import {
  getFragment,
  graphql,
  type FragmentType,
} from "@gc-digital-talent/graphql";
import { unpackMaybes } from "@gc-digital-talent/helpers";
import { narrowEnumType } from "@gc-digital-talent/i18n";
import { Pending, ThrowNotFound } from "@gc-digital-talent/ui";

import RequireAuth from "~/components/RequireAuth/RequireAuth";
import { TalentRequestSourceOptions_Fragment } from "~/components/SearchRequestFilters/fragment";
import useRequiredParams from "~/hooks/useRequiredParams";

import TalentRequestCriteriaCard from "./components/TalentRequestCriteriaCard";
import TalentRequestDetailsCard from "./components/TalentRequestDetailsCard";
import TalentRequestEmptyNotice from "./components/TalentRequestEmptyNotice";
import TalentRequestMatchesTable from "./components/TalentRequestMatchesTable/TalentRequestMatchesTable";
import type { TalentRequestReferralDialogOptions } from "./components/TalentRequestReferralDialogs/ReferralFormFields";
import TalentRequestSectionCard from "./components/TalentRequestSectionCard";
import TalentRequestSourcesCard from "./components/TalentRequestSourcesCard";
import type { RouteParams } from "./types";

const TalentRequestDetails_Fragment = graphql(/** GraphQL */ `
  fragment TalentRequestDetails on TalentRequest {
    ...TalentRequestEmptyNotice
    ...TalentRequestDetailsCard
    ...TalentRequestSourcesCard
    ...TalentRequestCriteriaCard
    ...TalentRequestMatchesTableTalentRequest

    applicantFilter {
      skills {
        ...TalentRequestUserSkillMatch
      }
    }
  }
`);

interface DetailsProps {
  query: FragmentType<typeof TalentRequestDetails_Fragment>;
  optionsQuery: FragmentType<typeof TalentRequestSourceOptions_Fragment>;
  referralOptionsQuery: TalentRequestReferralDialogOptions;
}

const Details = ({
  query,
  optionsQuery,
  referralOptionsQuery,
}: DetailsProps) => {
  const intl = useIntl();
  const talentRequest = getFragment(TalentRequestDetails_Fragment, query);
  const talentSourceOptions = narrowEnumType(
    unpackMaybes(
      getFragment(TalentRequestSourceOptions_Fragment, optionsQuery)
        ?.talentSource,
    ),
    "TalentRequestSource",
  );

  return (
    <div className="flex flex-col gap-y-6">
      <TalentRequestEmptyNotice query={talentRequest} />
      <TalentRequestDetailsCard query={talentRequest} />
      <TalentRequestSourcesCard
        query={talentRequest}
        talentSourceOptions={talentSourceOptions}
      />
      <TalentRequestCriteriaCard query={talentRequest} />
      <TalentRequestSectionCard
        color="warning"
        icon={MagnifyingGlassPlusIcon}
        title={intl.formatMessage({
          defaultMessage: "Find matching candidates",
          id: "CtcCZj",
          description:
            "Heading for the table that contains users who match talent request criteria",
        })}
        subtitle={intl.formatMessage({
          defaultMessage:
            "This list is always up-to-date, find new candidates that match to this talent request.",
          id: "JT8Azd",
          description:
            "Description of the table showing users who match talent request criteria",
        })}
      >
        <TalentRequestMatchesTable
          query={talentRequest}
          skillsQuery={unpackMaybes(talentRequest?.applicantFilter?.skills)}
          optionsQuery={referralOptionsQuery}
        />
      </TalentRequestSectionCard>
    </div>
  );
};

const TalentRequestDetails_Query = graphql(/** GraphQL */ `
  query TalentRequestDetails($id: UUID!) {
    talentRequest(id: $id) {
      ...TalentRequestDetails
    }
    ...TalentRequestSourceOptionsFragment
    ...TalentRequestReferralDialogOptions
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
        <Details
          query={data.talentRequest}
          optionsQuery={data}
          referralOptionsQuery={data}
        />
      ) : (
        <ThrowNotFound />
      )}
    </Pending>
  );
};

export const Component = () => (
  <RequireAuth
    roles={[
      ROLE_NAME.CommunityRecruiter,
      ROLE_NAME.CommunityAdmin,
      ROLE_NAME.PlatformAdmin,
    ]}
  >
    <TalentRequestDetailsPage />
  </RequireAuth>
);

Component.displayName = "AdminTalentRequestDetails";

export default Component;
