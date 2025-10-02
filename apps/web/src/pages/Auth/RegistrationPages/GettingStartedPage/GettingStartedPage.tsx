import { useIntl } from "react-intl";
import { useMutation, useQuery } from "urql";

import { Card, Pending, ThrowNotFound } from "@gc-digital-talent/ui";
import { ROLE_NAME, useAuthorization } from "@gc-digital-talent/auth";
import { graphql, Language } from "@gc-digital-talent/graphql";

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
  query GettingStarted {
    ...GettingStartedOptions
    me {
      id
      ...GettingStartedInitialValues
    }
  }
`);

const GettingStartedUpdateUser_Mutation = graphql(/** GraphQL */ `
  mutation GettingStartedUpdateUser($id: ID!, $user: UpdateUserAsUserInput!) {
    updateUserAsUser(id: $id, user: $user) {
      id
    }
  }
`);

const GettingStartedVerifyEmail_Mutation = graphql(/* GraphQL */ `
  mutation GettingStartedVerifyEmail($code: String!) {
    verifyUserEmails(code: $code) {
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

  const [, executeUpdateUserMutation] = useMutation(
    GettingStartedUpdateUser_Mutation,
  );
  const [, executeVerifyEmailMutation] = useMutation(
    GettingStartedVerifyEmail_Mutation,
  );

  const crumbs = useBreadcrumbs({
    crumbs: [
      {
        label: intl.formatMessage(messages.breadcrumb),
        url: paths.gettingStarted(),
      },
    ],
  });

  const handleSubmit = ({
    firstName,
    lastName,
    preferredLang,
    verificationCode,
  }: FormValues): Promise<void> => {
    // make TS happy but shouldn't happen
    if (!data?.me?.id) {
      throw new Error("No user ID provided");
    }
    if (!verificationCode) {
      throw new Error("No verification provided");
    }

    return (
      // first, try to update the user's personal information
      executeUpdateUserMutation({
        id: data?.me?.id,
        user: {
          firstName: firstName,
          lastName: lastName,
          preferredLang: preferredLang as Language,
        },
      })
        // check if the user update was successful
        .then((result) => {
          if (!result.data?.updateUserAsUser?.id) {
            throw new Error("Failed to update user");
          }
        })
        // second, try to verify the email
        .then(() =>
          executeVerifyEmailMutation({
            code: verificationCode,
          }),
        )
        // check if the email verification was successful
        .then((result) => {
          if (
            result.error?.graphQLErrors.some(
              (graphQLError) => graphQLError.message == "VERIFICATION_FAILED",
            )
          ) {
            throw new Error("VERIFICATION_FAILED");
          }
          if (!result.data?.verifyUserEmails?.id) {
            throw new Error("Failed to verify email");
          }
        })
        // finally, navigate away
        .then(() => {
          // TODO: navigate to next page
        })
    );
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
