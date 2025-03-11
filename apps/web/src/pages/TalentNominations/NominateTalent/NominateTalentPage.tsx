import { defineMessage, useIntl } from "react-intl";
import { Outlet } from "react-router";
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

const NominateTalent_Query = graphql(/* GraphQL */ `
  query NominateTalent($id: UUID!) {
    talentNomination(id: $id) {
      id
      talentNominationEvent {
        name {
          localized
        }
      }
    }
  }
`);

const pageTitle = defineMessage({
  defaultMessage: "Nominate talent",
  id: "cENNpj",
  description: "Title for the form to nominate talent",
});

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
        label: intl.formatMessage(pageTitle),
        url: paths.talentNomiation(id),
      },
    ],
  });

  return (
    <Pending fetching={fetching} error={error}>
      {data?.talentNomination ? (
        <>
          <SEO
            title={intl.formatMessage(pageTitle)}
            description={intl.formatMessage(subTitle)}
          />
          <Hero
            title={intl.formatMessage(pageTitle)}
            subtitle={intl.formatMessage(subTitle)}
            crumbs={crumbs}
          />
          <Outlet />
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
