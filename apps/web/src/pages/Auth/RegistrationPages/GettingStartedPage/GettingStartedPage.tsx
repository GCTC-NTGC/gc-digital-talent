import { useIntl } from "react-intl";
import { useMutation, useQuery } from "urql";

import { Card, Pending, ThrowNotFound } from "@gc-digital-talent/ui";
import { ROLE_NAME, useAuthorization } from "@gc-digital-talent/auth";
import { graphql, Language } from "@gc-digital-talent/graphql";
import { toast } from "@gc-digital-talent/toast";

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

  const handleSubmit = async ({
    firstName,
    lastName,
    preferredLang,
    verificationCode,
  }: FormValues) => {
    // make TS happy but shouldn't happen
    if (!data?.me?.id) {
      throw new Error("No user ID provided");
    }
    if (!verificationCode) {
      throw new Error("No verification provided");
    }

    try {
      await executeUpdateUserMutation({
        id: data?.me?.id,
        user: {
          firstName: firstName,
          lastName: lastName,
          preferredLang: preferredLang as Language,
        },
      }).then((result) => {
        if (!result.data?.updateUserAsUser?.id) {
          throw new Error("Failed to update user");
        }
      });
    } catch (_) {
      toast.error(
        intl.formatMessage({
          defaultMessage: "Failed to update account information.",
          id: "rAK3Dh",
          description:
            "Error message when updating a users account information",
        }),
      );
      return; // bail out
    }

    // if the user was updated successfully then try to verify the email
    try {
      await executeVerifyEmailMutation({
        code: verificationCode,
      }).then((result) => {
        if (!result.data?.verifyUserEmails?.id) {
          throw new Error("Failed to verify email");
        }
      });
    } catch (_) {
      toast.error(
        intl.formatMessage({
          defaultMessage: "Failed to verify the email address.",
          id: "mqXAMf",
          description: "Error message when the code is not valid.",
        }),
      );
      return; // bail out
    }
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
