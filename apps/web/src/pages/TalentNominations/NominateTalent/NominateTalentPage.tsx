import { defineMessage, useIntl } from "react-intl";
import { useQuery } from "urql";

import { Pending, ThrowNotFound } from "@gc-digital-talent/ui";
import { graphql } from "@gc-digital-talent/graphql";
import { ROLE_NAME } from "@gc-digital-talent/auth";
import { navigationMessages } from "@gc-digital-talent/i18n";

import useRequiredParams from "~/hooks/useRequiredParams";
import SEO from "~/components/SEO/SEO";
import Hero from "~/components/Hero";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import useRoutes from "~/hooks/useRoutes";
import RequireAuth from "~/components/RequireAuth/RequireAuth";

import { RouteParams } from "./types";
import Nominator from "./components/Nominator";
import Nominee from "./components/Nominee";
import Details from "./components/Details";
import Rationale from "./components/Rationale";
import ReviewAndSubmit from "./components/ReviewAndSubmit";
import Instructions from "./components/Instructions";

const NominateTalent_Query = graphql(/* GraphQL */ `
  query NominateTalent($id: UUID!) {
    talentNomination(id: $id) {
      id
      talentNominationEvent {
        name {
          localized
        }
      }

      ...NominateTalentNominator
      ...NominateTalentNominee
      ...NominateTalentDetails
      ...NominateTalentRationale
      ...NominateTalentReviewAndSubmit
    }
  }
`);

const subTitle = defineMessage({
  defaultMessage:
    "Nominate talent for advancement, lateral movement, or development programs.",
  id: "4adKE5",
  description: "Subtitle for the form to nominate talent",
});

const NominateTalentPage = () => {
  const intl = useIntl();
  const { id } = useRequiredParams<RouteParams>("id");
  const paths = useRoutes();
  const [{ data, fetching, error }] = useQuery({
    query: NominateTalent_Query,
    variables: { id },
  });

  const crumbs = useBreadcrumbs({
    crumbs: [
      {
        label: intl.formatMessage(navigationMessages.applicantDashboard),
        url: paths.applicantDashboard(),
      },
      {
        label: intl.formatMessage(navigationMessages.talentManagementEvents),
        url: paths.talentManagementEvents(),
      },
      {
        label: intl.formatMessage({
          defaultMessage: "Nominate talent",
          id: "3IwZ47",
          description: "Link text for the form to nominate talent",
        }),
        url: paths.talentNomiation(id),
      },
    ],
  });

  const pageTitle = intl.formatMessage(
    {
      defaultMessage: "Nominate talent for {eventName}",
      id: "7fY684",
      description: "Page title for the form to nominate talen",
    },
    {
      eventName:
        data?.talentNomination?.talentNominationEvent.name.localized ?? "",
    },
  );

  return (
    <Pending fetching={fetching} error={error}>
      {data?.talentNomination ? (
        <>
          <SEO title={pageTitle} description={intl.formatMessage(subTitle)} />
          <Hero
            title={pageTitle}
            subtitle={intl.formatMessage(subTitle)}
            crumbs={crumbs}
          />
          <Instructions />
          <Nominator nominatorQuery={data.talentNomination} />
          <Nominee nomineeQuery={data.talentNomination} />
          <Details detailsQuery={data.talentNomination} />
          <Rationale rationaleQuery={data.talentNomination} />
          <ReviewAndSubmit revieAndSubmitQuery={data.talentNomination} />
        </>
      ) : (
        <ThrowNotFound />
      )}
    </Pending>
  );
};

export const Component = () => (
  <RequireAuth roles={[ROLE_NAME.Applicant]}>
    <NominateTalentPage />
  </RequireAuth>
);

Component.displayName = "NominateTalentLayout";

export default Component;
