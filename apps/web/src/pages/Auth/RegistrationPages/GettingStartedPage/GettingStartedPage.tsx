import { useIntl } from "react-intl";
import { useMutation, useQuery } from "urql";

import { Card, Pending, ThrowNotFound } from "@gc-digital-talent/ui";
import { ROLE_NAME, useAuthorization } from "@gc-digital-talent/auth";
import {  graphql } from "@gc-digital-talent/graphql";

import Hero from "~/components/Hero";
import SEO from "~/components/SEO/SEO";
import RequireAuth from "~/components/RequireAuth/RequireAuth";
import useRoutes from "~/hooks/useRoutes";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import profileMessages from "~/messages/profileMessages";
import EmailVerificationProvider from "~/components/EmailVerification/EmailVerificationProvider";

import messages from "./messages";
import GettingStartedForm, { FormValues } from "./GettingStartedForm";

const GettingStarted_Query = graphql(/** GraphQL */ `
  query GettingStarted_Query {
    ...GettingStartedOptions_Query
    me {
      ...GettingStartedInitialValues_Query
    }
  }
`);

const GettingStarted_Mutation = graphql(/** GraphQL */ `
  mutation GettingStarted_Mutation($id: ID!, $user: UpdateUserAsUserInput!) {
    updateUserAsUser(id: $id, user: $user) {
      id
    }
  }
`);

const GettingStartedPage = () => {
  const intl = useIntl();
  const paths = useRoutes();
  const authContext = useAuthorization();
  const [{ data, fetching, error }] = useQuery({
    query: GettingStarted_Query,
  });

  const [, executeGeneralMutation] = useMutation(GettingStarted_Mutation);

  const crumbs = useBreadcrumbs({
    crumbs: [
      {
        label: intl.formatMessage(messages.breadcrumb),
        url: paths.gettingStarted(),
      },
    ],
  });

  const handleSubmit = async (formValues: FormValues) => {
    console.debug("handleSubmit", formValues);
    return Promise.resolve();
  };

  return (
    <>
      <SEO
        title={intl.formatMessage(messages.gettingStartedSectionTitle)}
        description={intl.formatMessage(messages.subtitle)}
      />
      <Hero
        title={intl.formatMessage(messages.title)}
        subtitle={intl.formatMessage(messages.subtitle)}
        crumbs={crumbs}
        overlap
      >
        <section className="mb-18">
          <Card space="lg">
            <Pending fetching={fetching || !authContext.isLoaded} error={error}>
              {data?.me ? (
                <EmailVerificationProvider>
                  <GettingStartedForm
                    initialValuesQuery={data.me}
                    optionsQuery={data}
                    onSubmit={handleSubmit}
                  />
                </EmailVerificationProvider>
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

export const Component = () => (
  <RequireAuth roles={[ROLE_NAME.Applicant]}>
    <GettingStartedPage />
  </RequireAuth>
);

export default GettingStartedPage;
