import { useIntl } from "react-intl";
import { useMutation, useQuery } from "urql";
import { createSearchParams, useNavigate, useSearchParams } from "react-router";

import { Card, Pending, ThrowNotFound } from "@gc-digital-talent/ui";
import { ROLE_NAME } from "@gc-digital-talent/auth";
import { graphql, Language } from "@gc-digital-talent/graphql";

import Hero from "~/components/Hero";
import SEO from "~/components/SEO/SEO";
import RequireAuth from "~/components/RequireAuth/RequireAuth";
import useRoutes from "~/hooks/useRoutes";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import profileMessages from "~/messages/profileMessages";
import { API_CODE_VERIFICATION_FAILED } from "~/components/EmailVerification/constants";
import EmailVerification from "~/components/EmailVerification/EmailVerification";

import messages from "../messages";
import GettingStartedForm, {
  FormValues,
  sectionTitle as gettingStartedSectionTitle,
} from "./GettingStartedForm";

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
  const navigate = useNavigate();
  const [{ data, fetching, error }] = useQuery({
    query: GettingStarted_Query,
  });

  const [, executeUpdateUserMutation] = useMutation(
    GettingStartedUpdateUser_Mutation,
  );
  const [, executeVerifyEmailMutation] = useMutation(
    GettingStartedVerifyEmail_Mutation,
  );

  const [searchParams] = useSearchParams();
  const from = searchParams.get("from");

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

    // first, try to update the user's personal information
    const updateUserResult = await executeUpdateUserMutation({
      id: data?.me?.id,
      user: {
        firstName: firstName,
        lastName: lastName,
        preferredLang: preferredLang as Language,
      },
    });

    // check if the user update was successful
    if (!updateUserResult.data?.updateUserAsUser?.id) {
      throw new Error("Failed to update user");
    }

    // second, try to verify the email
    const verifyEmailResult = await executeVerifyEmailMutation({
      code: verificationCode,
    });

    // check if the email verification was successful
    if (
      verifyEmailResult.error?.graphQLErrors.some(
        (graphQLError) => graphQLError.message == API_CODE_VERIFICATION_FAILED,
      )
    ) {
      throw new Error(API_CODE_VERIFICATION_FAILED);
    }
    if (!verifyEmailResult.data?.verifyUserEmails?.id) {
      throw new Error("Failed to verify email");
    }

    // finally, navigate away
    await navigate({
      pathname: paths.employeeInformation(),
      search: from ? createSearchParams({ from }).toString() : "",
    });
  };

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
        <section className="mb-18">
          <Card space="lg">
            <Pending fetching={fetching} error={error}>
              {data?.me ? (
                <EmailVerification.Provider>
                  <GettingStartedForm
                    initialValuesQuery={data.me}
                    optionsQuery={data}
                    onSubmit={handleSubmit}
                  />
                </EmailVerification.Provider>
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
