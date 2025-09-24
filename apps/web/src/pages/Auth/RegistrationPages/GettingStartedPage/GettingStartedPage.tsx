import { useIntl } from "react-intl";
import { useMutation, useQuery } from "urql";

import { Card, Pending, ThrowNotFound } from "@gc-digital-talent/ui";
import { ROLE_NAME, useAuthorization } from "@gc-digital-talent/auth";
import { EmailType, graphql } from "@gc-digital-talent/graphql";
import { workEmailDomainRegex } from "@gc-digital-talent/helpers";
import { toast } from "@gc-digital-talent/toast";
import { errorMessages } from "@gc-digital-talent/i18n";

import Hero from "~/components/Hero";
import SEO from "~/components/SEO/SEO";
import RequireAuth from "~/components/RequireAuth/RequireAuth";
import useRoutes from "~/hooks/useRoutes";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import profileMessages from "~/messages/profileMessages";

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

const EmailVerificationRequestACode_Mutation = graphql(/* GraphQL */ `
  mutation EmailVerificationRequestACode(
    $input: SendUserEmailsVerificationInput!
  ) {
    sendUserEmailsVerification(sendUserEmailsVerificationInput: $input) {
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
  const [, executeRequestACodeMutation] = useMutation(
    EmailVerificationRequestACode_Mutation,
  );

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

  const handleRequestEmail = async ({ email: emailAddress }: FormValues) => {
    if (!emailAddress) {
      throw new Error("Email address is required");
    }

    let emailTypes: EmailType[];
    if (workEmailDomainRegex.test(emailAddress)) {
      // Appears to be a valid work email address.  We'll update both at the same time.
      emailTypes = [EmailType.Contact, EmailType.Work];
    } else {
      emailTypes = [EmailType.Contact];
    }

    const mutationResult = executeRequestACodeMutation({
      input: {
        emailAddress,
        emailTypes,
      },
    }).then((result) => {
      if (!result.data?.sendUserEmailsVerification?.id) {
        throw new Error("Send email error");
      }
    });

    return mutationResult
      .then(() => {
        toast.success(
          intl.formatMessage({
            defaultMessage: "Verification email sent!",
            id: "oepQr+",
            description:
              "Title for a message confirming that the verification email was sent.",
          }),
        );
      })
      .catch(() => {
        toast.error(intl.formatMessage(errorMessages.error));
      });
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
                <GettingStartedForm
                  initialValuesQuery={data.me}
                  optionsQuery={data}
                  onSubmit={handleSubmit}
                  onRequestEmail={handleRequestEmail}
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

export const Component = () => (
  <RequireAuth roles={[ROLE_NAME.Applicant]}>
    <GettingStartedPage />
  </RequireAuth>
);

export default GettingStartedPage;
