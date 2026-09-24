import { useIntl } from "react-intl";
import { useQuery } from "urql";

import { Card, Pending, ThrowNotFound } from "@gc-digital-talent/ui";
import { graphql } from "@gc-digital-talent/graphql";
import { setInLocalStorage } from "@gc-digital-talent/storage";
import { ROLE_NAME } from "@gc-digital-talent/auth";
import { useFeatureFlags } from "@gc-digital-talent/env";

import Hero from "~/components/Hero";
import SEO from "~/components/SEO/SEO";
import useRoutes from "~/hooks/useRoutes";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import profileMessages from "~/messages/profileMessages";
import {
  KEY_NEW_USER_LANGUAGE_PRESET,
  KEY_NEW_USER_MIGRATION_NOTICE,
} from "~/constants/storageKeys";
import RequireAuth from "~/components/RequireAuth/RequireAuth";
import MigrationPossibleNotice from "~/components/InAppMigration/MigrationPossibleNotice";

import messages from "../messages";
import GettingStartedForm, {
  GETTING_STARTED_FORM_ID,
  sectionTitle as gettingStartedSectionTitle,
} from "./GettingStartedForm";

const GettingStarted_Query = graphql(/** GraphQL */ `
  query GettingStarted {
    me {
      id
      ...GettingStartedInitialValues
    }
    canMigrateMyAccount
  }
`);

const GettingStartedPage = () => {
  const intl = useIntl();
  const paths = useRoutes();
  const [{ data, fetching, error }] = useQuery({
    query: GettingStarted_Query,
  });
  const featureFlags = useFeatureFlags();

  // someone on this page is probably a new user so enable the new user flags
  setInLocalStorage<boolean>(KEY_NEW_USER_LANGUAGE_PRESET, true);
  setInLocalStorage<boolean>(KEY_NEW_USER_MIGRATION_NOTICE, true);

  const crumbs = useBreadcrumbs({
    crumbs: [
      {
        label: intl.formatMessage(messages.breadcrumb),
        url: paths.registrationAccount(),
      },
    ],
  });

  const showMigrationPossibleNotice =
    featureFlags.authInAppMigration && data?.canMigrateMyAccount;

  return (
    <>
      <SEO
        title={intl.formatMessage(gettingStartedSectionTitle)}
        description={intl.formatMessage(messages.subtitle)}
      />
      <Hero
        title={intl.formatMessage(messages.title)}
        subtitle={intl.formatMessage(messages.subtitle)}
        crumbs={crumbs}
        overlap
        centered
      >
        <section className="mb-18 flex flex-col gap-6">
          {showMigrationPossibleNotice ? (
            <MigrationPossibleNotice
              scrollToIdOnIgnore={GETTING_STARTED_FORM_ID}
            />
          ) : null}

          <Card space="lg">
            <Pending fetching={fetching} error={error}>
              {data?.me ? (
                <GettingStartedForm
                  initialValuesQuery={data.me}
                  canMigrateMyAccount={data.canMigrateMyAccount}
                />
              ) : (
                <ThrowNotFound
                  message={intl.formatMessage(profileMessages.userNotFound)}
                />
              )}
            </Pending>
          </Card>
        </section>
      </Hero>
    </>
  );
};

const Component = () => (
  <RequireAuth roles={[ROLE_NAME.Applicant]}>
    <GettingStartedPage />
  </RequireAuth>
);
Component.displayName = "GettingStartedPage";

export default Component;
